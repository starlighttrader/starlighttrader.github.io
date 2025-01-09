import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import { useEffect, useState } from 'react'

const LegalPage = ({ source }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleThemeChange = (e) => {
      setIsDarkMode(e.matches)
    }

    darkModeMediaQuery.addEventListener('change', handleThemeChange)
    return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className={`prose prose-lg mx-auto ${isDarkMode ? 'prose-invert' : ''}`}>
        <MDXRemote {...source} />
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