// Simple in-memory store for development when MongoDB is not available
class InMemoryDeliveryAreaStore {
  constructor() {
    this.areas = [];
    this.nextId = 1;
  }

  create(data) {
    const area = {
      _id: String(this.nextId++),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.areas.push(area);
    return Promise.resolve(area);
  }

  findAll() {
    return Promise.resolve([...this.areas].reverse());
  }

  findById(id) {
    const area = this.areas.find(a => a._id === id);
    return Promise.resolve(area || null);
  }

  update(id, data) {
    const index = this.areas.findIndex(a => a._id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.areas[index] = {
      ...this.areas[index],
      ...data,
      updatedAt: new Date()
    };
    return Promise.resolve(this.areas[index]);
  }

  delete(id) {
    const index = this.areas.findIndex(a => a._id === id);
    if (index === -1) return Promise.resolve(null);
    
    const deleted = this.areas.splice(index, 1)[0];
    return Promise.resolve(deleted);
  }

  clear() {
    this.areas = [];
    this.nextId = 1;
  }
}

module.exports = new InMemoryDeliveryAreaStore();
