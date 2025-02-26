import p5 from "p5";

export default class Circle { 
    p:p5;
    x:number;
    y:number;
    r:number;

    constructor(p:p5, x:number, y:number, r:number) { 
        this.p = p; 
        this.x = x; 
        this.y = y; 
        this.r = r; 
    } 
    display() { 
        this.p.ellipse(
            this.x, 
            this.y, 
            this.r, 
            this.r
        ); 
    } 
}