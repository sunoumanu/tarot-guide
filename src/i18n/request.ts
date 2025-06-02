import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
    // Provide a default locale if not defined
    const resolvedLocale = locale || 'en';

    return {
        messages: (await import(`../messages/${resolvedLocale}.json`)).default,
        locale: resolvedLocale
    };
});
