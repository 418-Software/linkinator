
export class PersistentListCache{
    name: string
    items: [string]

    constructor(name: string){
        this.name = name;
        this.items = [''];
    }

    add(item: string){
        // add new entry to cached list
        console.log("Adding item: " + item + " to " + this.name)
        this.refresh();
        if(this.items === undefined || this.items[0] === ''){
            this.items = [item];
        } else if(this.items.includes(item)){
            // Nothing to do here.
        } else {
            this.items.push(item);
        }
        this._set();
    }

    clear(){
        this.items = [''];
        this._set();
    }

    get(){
        return this.items;
    }

    _get() {
        // returns the full list being managed
        return new Promise((resolve, reject) =>
            chrome.storage.sync.get(this.name, result =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)
            )
        )
    }

    async refresh(): Promise<void>{
        // update local cache with data from upstream
        try {
            let result = await this._get() as Object
            let cache = result[this.name]
            if(cache === undefined){
                this.items = [''];
            } else {
                this.items = cache;
            }
        } catch (error) {
            console.log("Got error updating local: ", error)
            this.items = [''];
        }
    }

    remove(item: string){
        // remove cache entry from list
        var index = this.items.indexOf(item);
        if(index > -1){
            this.items.splice(index,1);
        }
        this._set();
    }

    set(data: [string]){
        this.items = data;
        this._set();
    }

    _set() {
        // sets the full list being managed
        var cacheObject = {};
        cacheObject[this.name] = this.items
        new Promise<void>((resolve, reject) =>
            chrome.storage.sync.set(cacheObject, () =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve()
            )
        )
    }
}