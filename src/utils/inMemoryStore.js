// Simple in-memory store for development when MongoDB is not available
class InMemoryDeliveryAreaStore {
  constructor() {
    this.areas = [];
    this.tradeCustomers = [];
    this.nextId = 1;
    this.nextCustomerId = 1;
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

  // Trade Customer methods
  createTradeCustomer(data) {
    const customer = {
      _id: String(this.nextCustomerId++),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tradeCustomers.push(customer);
    return Promise.resolve(customer);
  }

  findAllTradeCustomers() {
    return Promise.resolve([...this.tradeCustomers].reverse());
  }

  findTradeCustomerById(id) {
    const customer = this.tradeCustomers.find(c => c._id === id);
    return Promise.resolve(customer || null);
  }

  updateTradeCustomer(id, data) {
    const index = this.tradeCustomers.findIndex(c => c._id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.tradeCustomers[index] = {
      ...this.tradeCustomers[index],
      ...data,
      updatedAt: new Date()
    };
    return Promise.resolve(this.tradeCustomers[index]);
  }

  deleteTradeCustomer(id) {
    const index = this.tradeCustomers.findIndex(c => c._id === id);
    if (index === -1) return Promise.resolve(null);
    
    const deleted = this.tradeCustomers.splice(index, 1)[0];
    return Promise.resolve(deleted);
  }
}

module.exports = new InMemoryDeliveryAreaStore();
