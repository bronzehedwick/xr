import 'babel-core/polyfill';

const res = xhr => ({
  status: xhr.status,
  response: xhr.response,
  xhr: xhr,
  params: {}
});

const getParams = (data, url) => {
  let ret = [];
  for (let k in data) ret.push(`${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`);
  if (url.split('?').length > 1) ret.push(url.split('?')[1]);
  return ret.join('&');
};

const Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const defaults = {
  method: Methods.GET,
  data: undefined,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  dumpFn: JSON.stringify,
  loadFn: JSON.parse
};

const xr = args => new Promise((resolve, reject) => {
  let opts = Object.assign({}, defaults, args);
  let xhr = new XMLHttpRequest();
  let params = getParams(opts.params, opts.url);

  xhr.open(opts.method, params ? `${opts.url.split('?')[0]}?${params}` : opts.url, true);
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) resolve(Object.assign({}, res(xhr), {
      data: opts.loadFn(xhr.response)
    }), false);
    else reject(res(xhr));
  });

  for (let header in opts.headers) xhr.setRequestHeader(header, opts.headers[header]);
  for (let event in opts.events) xhr.addEventListener(event, opts.events[event].bind(xhr), false);

  xhr.send(typeof opts.data === 'object' ? opts.dumpFn(opts.data) : opts.data);
});

xr.Methods = Methods;
xr.defaults = defaults;

export default xr;