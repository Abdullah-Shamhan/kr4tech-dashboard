
export class FullPage {
    constructor(
    public id: string ,
    public enTitle: string ,
    public arTitle: string ,
    public enDescription: string ,
    public arDescription: string ,
    public buttonType : string ,
    public buttonSize: string ,
    public buttonColor: string ,
    public imageUrl: string ,
    public isFree: string  ,
    public pageType : string, 
    public content : any[],
    public dateAdded : string,
    public productCodeIOS? : string ,
    public productCodeANDROID ?: string ,
    ){}

}

