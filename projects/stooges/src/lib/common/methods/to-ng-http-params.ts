import { QueryParams } from "../../types";
import { HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';

export function toNgHttpParams(queryParams: QueryParams = {}): HttpParams {
    const encoder = new HttpUrlEncodingCodec();
    encoder.encodeKey = (k) => encodeURIComponent(k);
    encoder.encodeValue = (v) => encodeURIComponent(v);
    encoder.decodeKey = (k) => decodeURIComponent(k);
    encoder.decodeValue = (v) => decodeURIComponent(v);
    let params = new HttpParams({ encoder });
    Object.keys(queryParams).forEach(k => {
        const v = queryParams[k];
        params = params.set(k, v!);
    });
    return params;
}