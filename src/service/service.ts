import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class Service{

    baseUrl:String = 'http://192.168.64.227:3000';
    headers: Headers;
    options: RequestOptions;
    constructor(private _http: Http){    }
 
    verifyUser(data) {
        console.log("Inside Service");
        var info = JSON.stringify(data);
        var headers      = new Headers({'Content-Type': 'application/json'}); 
        var options      = new RequestOptions({ headers: headers });

        //var headers = new Headers();
        //headers.append('Access-Control-Allow-Origin', '*');
        console.log(info);

        //var body = JSON.stringify(data);
        return this._http.post(this.baseUrl+'/login',info,options).map((res)=>res.json());
    
    }
    
    registerUser(data) {
        console.log("Inside Register User Service");
        var info = JSON.stringify(data);
        console.log(info);
        var headers = new Headers({'Content-Type': 'application/json'}); 
        var options = new RequestOptions({ headers: headers });
        
        return this._http.post(this.baseUrl+'/registerUser',info,options).map((res)=>res.json());
    
    }

    updateDetails(data) {
        console.log("Inside Update User Details Service");
        var info = JSON.stringify(data);
        console.log(info);
        var headers = new Headers({'Content-Type': 'application/json'}); 
        var options = new RequestOptions({ headers: headers });
        
        return this._http.post(this.baseUrl+'/updateUserDetails',info,options).map((res)=>res.json());
    }
    
}

