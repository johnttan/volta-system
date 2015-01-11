var CircularBuffer = function(size){
  this._storage = [];
  this._head = 0;
  this._tail = 0;
  this._size = size;
  this.array = [];
};

CircularBuffer.prototype.eq = function(item){
  if(this._tail === this._head && this._lastOperation === 'write'){
    this._head = (this._head + 1) % this._size;
  };
  this._storage[this._tail] = item;
  this._tail = (this._tail + 1) % this._size;
  this._lastOperation = 'write';
  this.getArray();
};

CircularBuffer.prototype.dq = function(){
  if(this._head === this._tail && this._lastOperation === 'read'){
    console.log('queue empty');
    throw new Error('queue empty');
  }else{
    var result = this._storage[this._head];
    this._head = (this._head + 1) % this._size;
  };
  this._lastOperation = 'read';
  return result;
};

CircularBuffer.prototype.getArray = function(){
  var tempHead = this._head;
  var results = [];
  if(tempHead === this._tail){
    results.push(this._storage[tempHead]);
    tempHead = (tempHead + 1) % this._size;
  };

  while(tempHead !== this._tail){
    results.push(this._storage[tempHead]);
    tempHead = (tempHead + 1) % this._size;
  };
  this.array = results;
  return results;
};
