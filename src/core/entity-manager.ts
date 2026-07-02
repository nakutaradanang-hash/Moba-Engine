/**
 * Entity Manager - Manages game entities and components
 * Handles entity lifecycle, component management, and entity queries
 * Optimized for fast entity access and component lookups
 */

import { Logger } from '@utils/logger';
import type { Entity, IComponent } from './types';

/**
 * EntityManager handles entity lifecycle and component management
 * - Creates and destroys entities
 * - Manages component attachment/detachment
 * - Provides entity queries and lookups
 */
export class EntityManager {
  private logger: Logger;
  private entities: Map<string, Entity> = new Map();
  private entityCount: number = 0;
  private componentIndex: Map<string, Set<string>> = new Map(); // component type -> entity ids

  constructor() {
    this.logger = new Logger('EntityManager');
  }

  /**
   * Create a new entity
   */
  createEntity(id: string, name: string = ''): Entity {
    if (this.entities.has(id)) {
      this.logger.warn(`Entity '${id}' already exists, returning existing`);
      return this.entities.get(id)!;
    }

    const entity: Entity = {
      id,
      name: name || id,
      enabled: true,
      visible: true,
      components: new Map(),
      addComponent: (type: string, component: IComponent) => this.addComponent(entity, type, component),
      getComponent: (type: string) => this.getComponent(entity, type),
      hasComponent: (type: string) => entity.components.has(type),
      removeComponent: (type: string) => this.removeComponent(entity, type),
      destroy: () => this.destroyEntity(id),
    };

    this.entities.set(id, entity);
    this.entityCount++;

    this.logger.debug(`Entity '${id}' created`);
    return entity;
  }

  /**
   * Add entity (externally created)
   */
  addEntity(id: string, entity: Entity): void {
    if (this.entities.has(id)) {
      this.logger.warn(`Entity '${id}' already exists`);
      return;
    }

    this.entities.set(id, entity);
    this.entityCount++;

    this.logger.debug(`Entity '${id}' added`);
  }

  /**
   * Remove entity
   */
  removeEntity(id: string): void {
    const entity = this.entities.get(id);
    if (!entity) {
      this.logger.warn(`Entity '${id}' not found`);
      return;
    }

    this.destroyEntity(id);
  }

  /**
   * Get entity by id
   */
  getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  /**
   * Get all entities
   */
  getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Get entities by component type
   */
  getEntitiesWithComponent(componentType: string): Entity[] {
    const entityIds = this.componentIndex.get(componentType);
    if (!entityIds) return [];

    return Array.from(entityIds)
      .map((id) => this.entities.get(id))
      .filter((entity): entity is Entity => entity !== undefined);
  }

  /**
   * Get entity count
   */
  getEntityCount(): number {
    return this.entityCount;
  }

  /**
   * Add component to entity
   */
  private addComponent(entity: Entity, type: string, component: IComponent): IComponent {
    if (entity.components.has(type)) {
      this.logger.warn(`Entity '${entity.id}' already has component '${type}'`);
      return entity.components.get(type)!;
    }

    component.entity = entity;
    entity.components.set(type, component);

    // Update component index
    if (!this.componentIndex.has(type)) {
      this.componentIndex.set(type, new Set());
    }
    this.componentIndex.get(type)!.add(entity.id);

    // Lifecycle callbacks
    component.onAttach?.();
    if (entity.enabled) {
      component.onEnable?.();
    }

    this.logger.debug(`Component '${type}' added to entity '${entity.id}'`);
    return component;
  }

  /**
   * Get component from entity
   */
  private getComponent(entity: Entity, type: string): IComponent | undefined {
    return entity.components.get(type);
  }

  /**
   * Remove component from entity
   */
  private removeComponent(entity: Entity, type: string): void {
    const component = entity.components.get(type);
    if (!component) {
      this.logger.warn(`Component '${type}' not found on entity '${entity.id}'`);
      return;
    }

    // Lifecycle callbacks
    if (entity.enabled) {
      component.onDisable?.();
    }
    component.onDetach?.();

    entity.components.delete(type);

    // Update component index
    const entityIds = this.componentIndex.get(type);
    if (entityIds) {
      entityIds.delete(entity.id);
      if (entityIds.size === 0) {
        this.componentIndex.delete(type);
      }
    }

    this.logger.debug(`Component '${type}' removed from entity '${entity.id}'`);
  }

  /**
   * Destroy entity
   */
  private destroyEntity(id: string): void {
    const entity = this.entities.get(id);
    if (!entity) return;

    // Remove all components
    const componentTypes = Array.from(entity.components.keys());
    for (const type of componentTypes) {
      this.removeComponent(entity, type);
    }

    // Remove from entities map
    this.entities.delete(id);
    this.entityCount--;

    this.logger.debug(`Entity '${id}' destroyed`);
  }

  /**
   * Enable entity and all its components
   */
  enableEntity(id: string): void {
    const entity = this.entities.get(id);
    if (!entity) {
      this.logger.warn(`Entity '${id}' not found`);
      return;
    }

    if (entity.enabled) return;

    entity.enabled = true;
    for (const component of entity.components.values()) {
      component.onEnable?.();
    }

    this.logger.debug(`Entity '${id}' enabled`);
  }

  /**
   * Disable entity and all its components
   */
  disableEntity(id: string): void {
    const entity = this.entities.get(id);
    if (!entity) {
      this.logger.warn(`Entity '${id}' not found`);
      return;
    }

    if (!entity.enabled) return;

    entity.enabled = false;
    for (const component of entity.components.values()) {
      component.onDisable?.();
    }

    this.logger.debug(`Entity '${id}' disabled`);
  }

  /**
   * Show entity
   */
  showEntity(id: string): void {
    const entity = this.entities.get(id);
    if (entity) {
      entity.visible = true;
    }
  }

  /**
   * Hide entity
   */
  hideEntity(id: string): void {
    const entity = this.entities.get(id);
    if (entity) {
      entity.visible = false;
    }
  }

  /**
   * Clear all entities
   */
  clear(): void {
    const entityIds = Array.from(this.entities.keys());
    for (const id of entityIds) {
      this.destroyEntity(id);
    }

    this.componentIndex.clear();
    this.logger.info('All entities cleared');
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      entityCount: this.entityCount,
      componentTypeCount: this.componentIndex.size,
    };
  }

  /**
   * Log all entities for debugging
   */
  logEntities(): void {
    this.logger.info('=== Entities ===');
    for (const entity of this.entities.values()) {
      const status = entity.enabled ? '✓' : '✗';
      const components = Array.from(entity.components.keys()).join(', ');
      this.logger.info(
        `${status} ${entity.id} (${entity.name}): [${components}]`
      );
    }
  }
}
