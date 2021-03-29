export class Page {
    constructor(
    public id: string ,
    public enTitle: string ,
    public arTitle: string ,
    public enDescription: string ,
    public arDescription: string ,
    public buttonType : string ,
    public buttonSize: string ,
    public buttonColor: string ,
    public importFile: File ,
    public isFree: string  ,
    public pageType : string, 
    public productCodeIOS : string = null,
    public productCodeANDROID : string = null,
    ){}

}

