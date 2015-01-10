var CircularBuffer = function(size){
  this._storage = [];
  this.head = 0;
  this.tail = 0;
  this.size = size;
};

CircularBuffer.prototype.eq = function(item){
  console.log(this.lastOperation, this.head, this.tail, item);
  if(this.tail === this.head && this.lastOperation === 'write'){
    this.head ++;
  };
  this._storage[this.tail] = item;
  this.tail = (this.tail + 1) % this.size;
  this.lastOperation = 'write';
};

CircularBuffer.prototype.dq = function(){
  if(this.head === this.tail && this.lastOperation === 'read'){
    console.log('queue empty');
    throw new Error('queue empty');
  }else{
    var result = this._storage[this.head];
    this.head = (this.head + 1) % this.size;
  };
  this.lastOperation = 'read';
  return result;
};

module.exports = CircularBuffer;
