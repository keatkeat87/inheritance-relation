export function createAndAppendScriptAsync(src: string, id?: string): Promise<void> {
    return new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        script.src = src;
        script.onload = () => {
            resolve();
        };
        if (id) script.id = id;
        document.getElementsByTagName('head')[0].appendChild(script);
    });
}