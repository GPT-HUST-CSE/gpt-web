import MarkdownIt from 'markdown-it';
import markdownLink from 'markdown-it-link-attributes';
import hljs from 'highlight.js';

const md = new MarkdownIt({
    highlight: function(str, lang): string {
        if (lang && hljs.getLanguage(lang)) {
            try {
                // return hljs.highlight(str, { language: lang }).value;
                return `<pre class='all-code'><pre class="code-prefix"><div class="code-wrapper"><span>${lang}</span>` +
                `<button class="copy-code"><svg t="1722480371961" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2468" width="16" height="16"><path d="M337.28 138.688a27.968 27.968 0 0 0-27.968 27.968v78.72h377.344c50.816 0 92.032 41.152 92.032 91.968v377.344h78.656a28.032 28.032 0 0 0 27.968-28.032V166.656a28.032 28.032 0 0 0-27.968-27.968H337.28z m441.408 640v78.656c0 50.816-41.216 91.968-92.032 91.968H166.656a92.032 92.032 0 0 1-91.968-91.968V337.28c0-50.816 41.152-92.032 91.968-92.032h78.72V166.656c0-50.816 41.152-91.968 91.968-91.968h520c50.816 0 91.968 41.152 91.968 91.968v520c0 50.816-41.152 92.032-91.968 92.032h-78.72zM166.656 309.312a27.968 27.968 0 0 0-27.968 28.032v520c0 15.424 12.544 27.968 27.968 27.968h520a28.032 28.032 0 0 0 28.032-27.968V337.28a28.032 28.032 0 0 0-28.032-28.032H166.656z" p-id="2469" fill="#a4a4a4"></path></svg>复制代码</button>` + 
                `</div></pre><pre class="hljs"><div class='code'><code>` +
               hljs.highlight(str, { language: lang }).value +
               '</code></div></pre></pre>';
            } catch (__) {}
        }
        return ''
    }
});

md.use(markdownLink, { attrs: { target: '_blank', rel: 'noopener' } });

export const renderText = (text: string) => {
    return md.render(text)
}