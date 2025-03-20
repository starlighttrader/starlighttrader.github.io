import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import { useTheme } from '../../components/ThemeProvider'
import { Sun, Moon } from 'lucide-react'

const LegalPage = ({ source }) => {
  const { isDarkTheme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12 relative">
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkTheme ? (
            <Sun className="h-5 w-5 text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
        </button>
        <article className={`prose prose-lg mx-auto dark:prose-invert
          prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:text-gray-600 dark:prose-p:text-gray-300
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-ul:text-gray-600 dark:prose-ul:text-gray-300
          prose-li:text-gray-600 dark:prose-li:text-gray-300
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          [&>ul>li]:marker:text-gray-900 dark:[&>ul>li]:marker:text-white
          [&>ul]:marker:text-gray-900 dark:[&>ul]:marker:text-white
        `}>
          <MDXRemote {...source} />
        </article>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/mdx_docs'))
  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.md', '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const markdownFile = fs.readFileSync(
    path.join(process.cwd(), 'src/mdx_docs', `${slug}.md`),
    'utf-8'
  )

  const mdxSource = await serialize(markdownFile)

  return {
    props: {
      source: mdxSource
    }
  }
}

export default LegalPage 