import type { IndexHtmlTransformResult, HtmlTagDescriptor } from 'vite';

export const ConfigErudaPlugin = (
  {
    debug,
  }: {
    debug: boolean | undefined;
  } = {
    debug: undefined,
  },
) => {
  return {
    name: 'vite-plugin-eruda',
    transformIndexHtml(html: string): IndexHtmlTransformResult {
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'script',
          attrs: {
            src: '/static/lib/eruda@2.4.1/eruda.js',
          },
          injectTo: 'head',
        },
        {
          tag: 'script',
          children: `
            eruda.init();
            eruda.get('network')._showDetail = function(data) {
            
                if (data.resTxt && data.resTxt.trim() === '') {
                  delete data.resTxt
                }
                if (!data.resHeaders) {
                  delete data.resHeaders
                }
                if (!data.reqHeaders) {
                  delete data.reqHeaders
                }
            
                data.data = data.data && JSON.stringify(JSON.parse(data.data), undefined, 2)
                data.resTxt = data.resTxt && JSON.stringify(JSON.parse(data.resTxt), undefined, 2)
                this._$detail.html(this._detailTpl(data)).show()
                this._detailData = data
            }
          `,
          injectTo: 'head',
        },
      ];
      if (debug === true) {
        return {
          html,
          tags,
        };
      } else if (debug === false) {
        return html;
      }
      // @ts-ignore
      if (process.env.NODE_ENV !== 'production') {
        return {
          html,
          tags,
        };
      } else {
        return html;
      }
    },
  };
};
