import {IAssetInfo} from "./i-assets-info";


export class AssetsInfoCommand {

    constructor(){
        this.logTimingAndResponseHeadersInfoOfAllAssets();
        this.clearResourceTimings();

    }

    /**
     * Generates the game client assetInfo object
     * The following method illustrates using the resource timing properties to calculate the amount of time the following phases take: redirection (redirectStart and redirectEnd ),
     * DNS lookup (domainLookupStart and domainLookupEnd), TCP handshake (connectStart and connectEnd), and response (responseStart and responseEnd).
     * This method also calculates the time from the start of the fetch and request start phases (fetchStart and requestStart, respectively), until the response has ended (responseEnd).
     * This timing data provides a detailed profile of the resource loading phases and this data can be used to help identify performance bottlenecks.
     * The size of an application's resources can affect an application's performance so getting accurate data on resource size can be important (especially for non-hosted resources).
     * The PerformanceResourceTiming interface has three properties that can be used to obtain size data about a resource.
     * The transferSize property returns the size (in octets) of the fetched resource including the response header fields plus the response payload body.
     * The encodedBodySize property returns the size (in octets) received from the fetch (HTTP or cache), of the payload body, before removing any applied content-codings.
     * decodedBodySize returns the size (in octets) received from the fetch (HTTP or cache) of the message body, after removing any applied content-codings.
     * @private
     */
    private logTimingAndResponseHeadersInfoOfAllAssets(): void {
        // Check performance support
        if (performance === undefined) {
            console.log("= Calculate Load Times: performance NOT supported");
            return;
        }
        //The resourcetimingbufferfull event is fired at the Performance object when the browser's resource performance entry buffer is full.
        performance.onresourcetimingbufferfull = this.bufferFull.bind(this);
        // Get a list of "resource" performance entries
        const resources:any = performance.getEntriesByType("resource");
        if (resources === undefined || resources.length <= 0) {
            console.log("= Calculate Load Times: there are NO `resource` performance records");
            return;
        }
        console.log("= Calculate Load Times");
        let numberOfResources:number=0;
        resources.forEach((resource:any, i:number) => {
            this.getAssetsResponsesHeaders(resource.name).then((result)=> {
                let assetInfo: IAssetInfo = {
                    'name': this.getFileNameFromURL(resource.name),
                    'entryType': resource.entryType,
                    'initiatorType': resource.initiatorType,
                    'fetchStart': resource.fetchStart,
                    'redirectEnd': resource.redirectEnd,
                    'redirectStart': resource.redirectStart,
                    'redirectTime': resource.redirectEnd - resource.redirectStart,
                    'domainLookupEnd': resource.domainLookupEnd,
                    'domainLookupStart': resource.domainLookupStart,
                    'DNSLookupTime': resource.domainLookupEnd - resource.domainLookupStart,
                    'connectEnd': resource.connectEnd,
                    'connectStart': resource.connectStart,
                    'TCPTime': resource.connectEnd - resource.connectStart,
                    'secureConnectionStart': resource.secureConnectionStart,
                    'secureConnectionTime': (resource.secureConnectionStart > 0) ? (resource.connectEnd - resource.secureConnectionStart) : 0,
                    'responseEnd': resource.responseEnd,
                    'responseStart': resource.responseStart,
                    'responseTime': resource.responseEnd - resource.responseStart,
                    'fetchUntilResponseEndTime': (resource.fetchStart > 0) ? (resource.responseEnd - resource.fetchStart) : 0,
                    'requestStartUntilResponseEndTime': (resource.requestStart > 0) ? (resource.responseEnd - resource.requestStart) : 0,
                    'requestStart': resource.requestStart,
                    'startTime': resource.startTime,
                    'startUntilResponseEndTime': (resource.startTime > 0) ? (resource.responseEnd - resource.startTime) : 0,
                    'decodedBodySize': ('decodedBodySize' in resource) ? resource.decodedBodySize : null,
                    'encodedBodySize': ('encodedBodySize' in resource) ? resource.encodedBodySize : null,
                    'transferSize': ('transferSize' in resource) ? resource.transferSize : null,
                    'header': result,
                    'url': resource.name,
                };
                console.log(JSON.stringify(assetInfo, null, '\t'));
                console.log(assetInfo.name + '\n' + assetInfo.transferSize/1000+' kb' + '\n');
                numberOfResources=i;
            }).then(()=>{console.log(`--The total number of resources: ${numberOfResources}`)});
        });
    }


    /**
     *This method examines the headers in the request's readystatechange event.
     *The code shows how to obtain the raw header string, as well as how to convert it into an array of individual headers and then how to take that array and create a mapping of header names to their values.
     @private
     */
    private  getAssetsResponsesHeaders(path:any):Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('HEAD', path, true);
            try {
                request.send(null);
                request.onreadystatechange = () => {
                    if (request.status == 404) {
                        resolve(null);
                        request.abort();
                    } else if (request.status === 200 || request.status === 304) {
                        if (request.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                            //
                            // The following headers may often be similar
                            // to those of the original page request...
                            //
                            // Get the raw header string
                            let headers:string = request.getAllResponseHeaders();
                            // Convert the header string into an array
                            // of individual headers
                            if(headers!=undefined) {

                                /*
                                // Create a map of header names to values we don't use it yet but i let it here for future use
                                const arr = headers.trim().split(/[\r\n]+/);
                                const headerMap = {};
                                arr.forEach((line) => {
                                    const parts = line.split(': ');
                                    const header = parts.shift();
                                    const value = parts.join(': ');
                                    headerMap[header] = value;
                                });
                                 */

                                resolve(headers);
                                request.abort();
                            } else {
                                resolve(null);
                                request.abort();
                            }
                        }
                    }
                }
            } catch (e) {
                resolve(null);
                request.abort();
            }
        });
    }


    /**
     * Although the browser is required to support at least 150 resource timing performance entries in its resource timing buffer, some applications may use more resources than that limit.
     * To help the developer manage the buffer size, Resource Timing defines two methods that extend the Performance interface.
     * The clearResourceTimings() method removes all "resource" type performance entries from the browser's resource performance entry buffer.
     * @private
     */

    private clearResourceTimings():void {
        if (performance === undefined) {
            console.log("= performance.clearResourceTimings(): performance NOT supported");
            return;
        }
        // Check if Performance.clearResourceTiming() is supported
       console.log ("= Print performance.clearResourceTimings()");
        const supported = typeof performance.clearResourceTimings === "function";
        if (supported) {
            console.log("… Performance.clearResourceTimings() = supported");
            performance.clearResourceTimings();
        } else {
            console.log("… Performance.clearResourceTiming() = NOT supported");
            return;
        }
        // getEntries should now return zero
        const p = performance.getEntriesByType("resource");
        if (p.length === 0) {
            console.log("… Performance data buffer cleared");
        } else {
            console.log(`… Performance data buffer NOT cleared (still have '${p.length}' items`);
        }
    }


    /**
     * The setResourceTimingBufferSize() method sets the resource performance entry buffer size to the specified number of resource performance entries.
     * @private
     */
    private setResourceTimingBufferSize(n:number):void {
        if (performance === undefined) {
            console.log("= performance.setResourceTimingBufferSize(): performance NOT supported");
            return;
        }
        // Check if Performance.setResourceTimingBufferSize() is supported
        console.log("= performance.setResourceTimingBufferSize()");
        const supported = typeof performance.setResourceTimingBufferSize === "function";
        if (supported) {
            console.log("… Performance.setResourceTimingBufferSize() = supported");
            performance.setResourceTimingBufferSize(n);
        } else {
            console.log("… Performance.setResourceTimingBufferSize() = NOT supported");
        }
    }

    /**
     * The resourcetimingbufferfull event is fired at the Performance object when the browser's resource performance entry buffer is full.
     * The following methods sets an onresourcetimingbufferfull event handler in the getAssetsInfo() method
     * @private
     */

    private bufferFull(event:Event):void {
        const NEW_BUFFER_SIZE:number = 500;
        console.log("WARNING: Resource Timing Buffer is FULL!");
        this.setResourceTimingBufferSize(NEW_BUFFER_SIZE);
    }
    /**
     * Method used to retrieve the file name from url.
     *
     * @param {string} url
     * @param {boolean} withExtension
     */
    private getFileNameFromURL(url: string, withExtension: boolean = false): string {
        return withExtension || url.indexOf('.') == -1
            ? url.split('/').pop()
            : url.slice(0, url.lastIndexOf('.')).split('/').pop();
    }
}