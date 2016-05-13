/**
 * 防止undefined在低版本ie中被重写
 */
;
(function (global, undefined) {
    // 防止重复加载
    // 如果该表达式成立，当前类库之前被加载过。所以直接return，什么都不执行。
    if (global.x) {
        return;
    }

    var x = global.x = {};

    var ajax = function (options) {
        // 判断参数类型
        if (!tools.getType(options, 'Object')) {
            throw new TypeError('参数类型错误');
        }
        // ajax第一步
        var xhr = tools.getXHR();

        // 格式化options.data 把data格式化为uri string
        if (options.processData === undefined || options.processData === true) {
            if (tools.getType(options.data, 'Object')) {
                options.data = tools.encodeDataToURI(options.data);
            }
        }

        // 如果是get系方法 把data拼接到url后面
        if (/^(get|delete|head)$/img.test(options.method)) {
            options.url = tools.hasSearch(options.url, options.data);
            // 如果是get系就把data清空，说明只有post系才有data
            options.data = null;
        }

        // 如果不缓存 往url后面加一个随机数
        if (options.cache === false) {
            var random = (~~(Math.random() * 0xffffff)).toString(36);
            options.url = tools.hasSearch(options.url, '_=' + random);
        }
        // 如果没有传async。则默认为true
        if (options.async === undefined) {
            options.async = true;
        }
        // ajax第二步
        xhr.open(options.method, options.url, options.async, options.username, options.password);

        // 自定义请求首部
        tools.forIn(options.headers, function (key, value) {
            xhr.setRequestHeader && xhr.setRequestHeader(key, value);
        });

        // ajax第三步
        xhr.onreadystatechange = function () {
            // 判断http事务是否完成
            if (xhr.readyState === 4) {
                // 判断状态码
                if (/^2\d{2}$/.test(xhr.status)) {
                    var response = xhr.responseText;
                    if (options.dataType === 'json') {
                        // 为了不是合法的json字符串执行jsonparse会抛出异常
                        try {
                            response = tools.JSONParse(response);
                        } catch (ex) {
                            options.error(ex);
                            return;
                        }
                    }
                    options.success(response);
                }
                else if (/^(4|5)\d{2}$/.test(xhr.status)) {
                    options.error(xhr.status);
                }
            }
        };
        // 判断是否执行超时
        if (options.timeout > 0) {
            xhr.timeout = +options.timeout;
            // 当前浏览器支持超时
            if ('ontimeout' in xhr) {
            //if (xhr.ontimeout) {
                xhr.ontimeout = function () {
                    options.error('timeout');
                }
            } else {
                // 如果超时时间已到，但是http事务并没有完成则强制终止
                setTimeout(function () {
                    if (xhr.readyState !== 4) {
                        xhr.abort();
                    }
                }, xhr.timeout);
            }
        }
        // ajax第四步
        xhr.send(options.data);
    };

    var tools = {
        /**
         * 获取ajax对象
         */
        getXHR: (function () {
            var xhrList = [function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }, function () {
                return new ActiveXObject('MsXML2.XMLHTTP');
            }, function () {
                return new ActiveXObject('MsXML3.XMLHTTP');
            }];
            var xhr = null;
            while (xhr = xhrList.shift()) {
                try {
                    // 如果报错，说明当前浏览器不支持该对象
                    xhr();
                    break;
                } catch (ex) {
                    xhr = null;
                    continue;
                }
            }
            // 如果循环完毕之后，xhr为null 说明以上的4中对象 当前浏览器都不支持
            if (xhr === null) {
                throw new ReferenceError('当前浏览器不支持ajax功能');
            }
            // 如果xhr不为null xhr里头return的那个对象就是当前浏览器最合适的那个ajax对象
            return xhr;
        })(),
        /**
         * 判断数据类型
         * @param data
         * @param type
         * @returns {boolean}
         */
        getType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']';
        },
        /**
         * for in 循环帮助函数
         * @param data
         * @param callback
         */
        forIn: function (data, callback) {
            if (this.getType(data, 'Object')) {
                for (var n in data) {
                    if (!data.hasOwnProperty(n)) continue;
                    callback.call(undefined, n, data[n]);
                }
            }
        },
        /**
         * 把一个对象格式化为URI string的格式
         * @param data
         * @return {string}
         */
        encodeDataToURI: function (data) {
            if (this.getType(data, 'String')) {
                return data;
            }
            var arr = [];
            this.forIn(data, function (key, value) {
                // 把非英文字符格式化为URI
                arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            });
            return arr.join('&');
        },
        /**
         * 往url后面拼接参数
         * @param url
         * @param padString
         * @returns {string}
         */
        hasSearch: function (url, padString) {
            return url + (/\?/.test(url) ? '&' : '?') + padString;
        },
        /**
         * 把json字符串转化为json对象
         * @param jsonString
         * @return {Object}
         */
        JSONParse: function (jsonString) {
            if (!this.getType(jsonString, 'String')) {
                return jsonString;
            }
            if (window.JSON) {
                return JSON.parse(jsonString);
            }
            return eval('(' + jsonString + ')');
        }
    };
    x.ajax = ajax;

})(window);