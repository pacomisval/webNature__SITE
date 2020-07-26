import { Route } from './route.js';

export class Router {

    constructor() {
        this.mode = 'history';
        this.routes = [];
        this.root = '/';
    }

    get root() {
        return this._root;
    }
    set root(val) {
        this._root = val;
    }

    get mode() {
        return this._mode;
    }
    set mode(val) {
        this._mode = (val == 'history' && window.history.pushState) ? 'history' : 'hash';
    }

    get routes() {
        return this._routes;
    }
    set routes(val) {
        this._routes = val;
    }

    add(route) {
        this.routes.push(new Route(route.name, route.path, route.handler));
        return this;
    }

    navigate(route) {
        route = route ? route : '';
        console.log("valor de route: " + route);
        this.match(route);
    }

    match(route) {
        for (var i = 0; i < this.routes.length; i ++) {
            let paramNames = [];
            // console.log("valor de routes[i].path: " + this.routes[i].path);
            // console.log("valor de routes[i].name: " + this.routes[i].name);
            let regexPath = this.routes[i].path.replace(/([:*])(\w+)/g, function (full, colon, name) {
                paramNames.push(name);
                return '([^\/]+)';
            }) + '(?:\/|$)';
            //console.log("valor de regexPath: " + regexPath);
            //console.log("valor de paramNames: " + paramNames);

            let routeMatch = route.match(new RegExp(regexPath));
            console.log("valor de routeMatch: " + routeMatch);
            
            if (routeMatch !== null) {
                console.log("valor de routeMatch.length: " + routeMatch.length);
                var params = routeMatch
                
                .slice(1, routeMatch.length)
                .reduce((params, value, index) => {
                    if (params === null) params = {};

                    if (routeMatch.length == 2) {
                        params = value;
                    }
                    else {
                        params[paramNames[index]] = value;
                    }
                    
                    console.log("valor de params: " + params[0])
                    console.log("valor de value: " + value);
                    return params
                }, null);
                
                if (params === null) {
                    this.routes[i].handler();
                }
                else {
                    this.routes[i].handler(params);
                }
                this.location(route);
            }
        }
    }
    location(route) {
        if (this.mode === 'history') {
            window.history.pushState(null, null, this.root + route);
        }
        else {
            route = route.replace(/^\//, '').replace(/\/$/, '');
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + route;
        }
    }

}