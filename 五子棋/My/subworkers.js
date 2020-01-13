(function(){

    var isWorker = false;
    try{
        document;
    }catch(e){
        isWorker = true;
    }

    if(isWorker){
        if(!self.Worker){
            self.Worker = function(path){
                var that = this;
                this.id = Math.random().toString(36).substr(2, 5);

                this.eventListerners = {
                    "message": []
                };
                self.addEventListener("message", function(e){
                    if(e.data._form == this.id){
                        var newEvent = new MessageEvent("message");
                        newEvent.initMessageEvent("message", false, false, e.data.message, that, "", null, []);
                        that.dispatchEvent(newEvent);
                        if(that.onmessage){
                            that.onmessage(newEvent);
                        }
                    }
                });

                var location = self.location.pathname;
                var absPath = location.substring(0, location.lastIndexOf('/')) + '/' + path;
                self.postMessage({
                    _subworker: true,
                    cmd: 'newWorker',
                    id: this.id,
                    path: absPath
                });
            };

            Worker.prototype = {
                onerror: null,
                onmessage: null,
                postMessage: function(message){
                    self.postMessage({
                        _subworker: true,
                        id: this.id,
                        cmd: 'passMessage',
                        message: message
                    });
                },
                terminate: function(){
                    self.postMessage({
                        _subworker: true,
                        cmd: 'terminate',
                        id: this.id
                    });
                },
                addEventListener: function(type, listener, useCapture){
                    if(this.eventListerners[type]){
                        this.eventListerners[type].push(listener);
                    }
                },
                removeEventerListener: function(type, listener, useCapture){
                    if(!(type in this.eventListerners)){
                        return;
                    }
                    varindex = this.eventListerners[type].indexOf(listener);
                    if(index !== -1){
                        this.eventListerners[type].splice(index, 1);
                    }
                },
                dispatchEvent: function(event){
                    var listeners = this.eventListerners[event.type];
                    for(var i = 0; i < listeners.length; ++i){
                        listeners[i](event);
                    }
                }
            };
        }
    }

    var allWorkers = {};
    var cmd = {
        newWorker: function(event){
            var worker = new Worker(event.data.path);
            worker.addEventListener("message", function(e){
                var envelop = {
                    _form: event.data.id,
                    message: e.data
                }
                event.target.postMessage(envelop);
            });
            allWorkers[event.data.id] = worker;
        },
        terminate: function(event){
            allWorkers[event.data.id].postMessage(event.data.message);
        }
    }
    var messageRecieved = function(event){
        if(event.data._subworker){
            cmds[event.data.cmd](event);
        }
    };

    var oldWorker = Worker;
    Worker = function(path){
        if(this.constructor !== Worker){
            throw new TypeError("Failed to construct 'Worker': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
        }

        var blobIndex = path.indexOf('blob:');

        if(blobIndex !== -1 && blobIndex !== 0){
            path = path.substring(blobIndex);
        }

        var newWorker = new oldWorker(path);
        newWorker.addEventListener("message", messageRecieved);

        return newWorker;
    };

})();