export class Hero{
    constructor(
        public id:string,
        public nickname:string,
        public name:string,
        public picture:string,
        public description:string
    ){}
}

export class PaginatedHeroes{
    constructor(
        public first:number,
        public prev:number,
        public next:number,
        public last:number,
        public pages:number,
        public items: number,
        public data:Hero[]
    ){}
}