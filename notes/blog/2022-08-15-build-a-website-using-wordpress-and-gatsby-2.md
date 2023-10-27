---
layout: blog
title: "Build a website with Wordpress and Gatsby"
description: "Take the power of the blocks in the editor of Wordpress and the speed of a static website of GatsbyJS."
tags: [Web Dev, Wordpress, GatsbyJS, Static Site Generators, CMS]
toc: true
math: false
part: 2
basePartUrl: build-a-website-using-wordpress-and-gatsby
partName: Building the components
keywords: "math2it wordpress website ssg static site generator cms tailwind css fontello packages components navigation taxonomy category tag pages individual post template layout styling popular latest random table of content toc comment system images external images graphql troubleshooting search"
date: 2022-10-09
---

In this part we will learn in detail how to use Gatsby to create components for a website and take the data for each component from Wordpress.

> The final source code: https://github.com/dinhanhthi/wordpress-gatsby

## Getting started to style your site

::: warning

I do not talk too much about how to make your website like mine. That's something personal! I also do not talk about React syntax ([The official document](https://reactjs.org/docs/getting-started.html) is great enough and it's out of scope for this post!). I am just talking about the techniques and tips I use to build the parts of the site.

:::

### Useful packages

_Some descriptions are taken directly from the introduction of the projects._

- [cntl](https://github.com/michal-wrzosek/cntl): If you use a library like *Tailwind* css where you compose your styles by providing lots of class names this utility tool can help you a lot.
- [React Icons](https://react-icons.github.io/react-icons/): Include popular icons in your React projects easily with react-icons, which utilizes ES6 imports that allows you to include only the icons that your project is using.

### Using Fontello

[Fontello](https://fontello.com/) is an icon font generator that you can see as an alternative to [Fontawesome](https://fontawesome.com/). It includes several free icons from various services and allows you to upload your own icons (svg files) and create the appropriate icon fonts for you.

:point_right: [IcoMoon](https://icomoon.io/) is another wonderful alternative.

```bash
npm install -g fontello-cli
```

On fontello.com, upload the configuration file from `/src/fontello/config.json`. Add any other icons you want. After making your selection, click "**Get config only**".

Create a shortcut like this in `package.json`,

```json
{
  "scripts": {
    "ud-fontello": "npx rimraf .fontello-session && fontello-cli --config src/fontello/config.json --css src/fontello/css --font src/fontello/font install"
  }
}
```

If you have any updates, just go to the source folder and run `npm run ud-fontello`!

::: warning

Sometimes, there are duplicates of hex/decimal codes (although the names are different). Navigate to the "*Customize Codes*" tab on the fontello website, find the duplicates, and change them. Note that, on this tab, the codes are displayed in hexa-base, while in the downlowded configuration they are displayed in decimal-base (`"code"` field). On [this site](https://www.rapidtables.com/convert/number/decimal-to-hex.html) you can convert the two formats.

:::

::: hsbox Add a custom icon?

1. Search for an icon (e.g. svg images) + download it.
   1. Free SVG icon: [site](https://uxwing.com/).
   2. If you need to crop an image? Use [this site](https://www.iloveimg.com/crop-image).
   3. Need to convert an image to svg? Use [this site](https://www.pngtosvg.com/).
2. Drag and drop this icon to fontello site.

:::

Finally, add the following line to `gatsby-browser.tsx`,

```tsx
import './src/fontello/css/fontello.css'
```

How to use?

```html
<i className="icon-right-open"></i>
```

### A component with options

Suppose you want to create a `Navigation` component for the menu bar (`src/components/navigation.tsx`),

```typescript
import * as React from 'react'

type NavigationOptions = {
  bgClass?: string
}

export default function Navigation({ options }: { options?: NavigationOptions }) {
	return <div>This is the navigation!</div>
}
```

In `src/layouts/base.tsx`,

```typescript {% raw %}
import * as React from 'react'
import Navigation from '../components/navigation'

export default function Base({ children }) {
  return (
    <>
      <Navigation options={{ bgClass: 'bg-white' }} />
      <main role="main">{children}</main>
      <Footer />
    </>
  )
}
{% endraw %}
```

## Navigation (menu bar)

Use the shortcodes as in [the previous section](#a-component-with-options). In this section you will learn how to retrieve menu data from Wordpress and read it into Gatsby.

👉 [An example of a navigation bar](https://github.com/dinhanhthi/dinhanhthi.com-v4-gatsby/blob/main/src/components/navigation.tsx) from my personal blog based on Tailwind ([demo](https://dinhanhthi-com-v4-gatsby.netlify.app/)).

To get data from WP Menu, on WP head to Appearance > Menus > Create a menu (or choose an existing one).

## Create taxonomy pages

In Wordpress, taxonomy pages are pages like **categories** and **tags** (pages that contain all posts in a category or tag). However, this section is also useful for creating pages like "**author**".

For example, we will create a page like `/category/math/` that contains a list of posts in the category "Math".

To create such a custom page like that, Gatbsy uses [`createPage`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#createPages). Broadly speaking, we proceed as follows,

::: hsbox TL;DR;

1. `gatsby develop` → using `gatsby-node.ts` to create pages.
2. In `gatsby-node.ts`:
   1. Use `getCategoryData()` to get the category data (all categories and their names, descriptions, URLs,...).
   2. `createTaxonomyPage()` uses the data from the previous step to feed the `createPage()` function. This function needs **path** (e.g. `/category/math/`), **component** (a template for the category in `src/templates/template-category.tsx`), **context** (data to be used in GraphQL queries in the template).
3. The category template in `src/templates/template-category.tsx` uses a "blueprint" specified in `src/layouts/taxonomy.tsx`. This blueprint is also used for tag and author pages.

:::

::: hsbox More details

1. `gatsby develop` → using `gatsby-node.ts` to create pages.

2. In `gatsby-node.ts`:

   1. We use `getCategoryData()` to get the category data. This function is a graphql query to get information about all the categories in the WP site (name, description, URL) with the number of posts in each category. All this information is parsed in `createTaxonomyPage()`, the main function to create category pages.

   2. In `createTaxonomyPage()` we use the information given in the previous step to create pages for each category using `createPage()`. To do this, we need to specify which template to use? (What will the final page look like after generation?). This is when we create `src/templates/template-category.tsx`, which contains our template.

      There are 3 main inputs of `createPage()`: **path** (the path of the category page, e.g. `/category/math/`), **component** (the template component imported from `src/templates/template-category.tsx`) and **context** (all the informations needed to parse this template for Graphql queries. The information could be: "number of posts per page", "index of the post we start with", "name of the category", "URL of the category", "total number of pages" if we limit the number of posts per page, ...)

3. Create a category template in `src/templates/template-category.tsx`: this will take the data from gatsby-node.ts and query WP for the required data to create a category page. The query could be the detailed information about the posts in that category that should be displayed. Note that the template for categories is almost the same as the template for tags or authors (you can make it different if you want), so I have a "blueprint" for three of them called the "taxonomy" layout.

4. The taxonomy layout (in `src/layouts/taxonomy.tsx`) is a general layout for all 3 types of pages (category, tag and author).

:::

::: warning

The following codes are examples only, they do not include error checking steps. You will need to add more codes to make sure everything works!

:::

::: hsbox `src/layouts/taxonomy.tsx`

```tsx
import React from 'react'
import { Link } from 'gatsby'

export function TaxonomyPage(props) {
  const { data, context, type } = props
	const posts = data.allWpPost.nodes
  return (
  	<>
    	<h1>{context.taxonomyName}</h1>
    	<h3>{context.taxonomyDescription}</h3>

    	<div class="list-of-posts">
    		{posts.map((post: any) => (
          <Link key={post.uri} to={post.uri}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </Link>
      	))}
    	</div>
    </>
  )
}
```

:::

::: hsbox `src/templates/template-category.tsx`

```tsx
import { graphql } from 'gatsby'
import * as React from 'react'
import { TaxonomyPage } from '../layouts/taxonomy'

export default function CategoryPage(props) {
  return <TaxonomyPage data={props.data} context={props.pageContext} />
}

export const pageQuery = graphql`
  query WPCategoryPosts($taxonomyUri: String) {
    allWpPost(
      filter: {
        categories: { nodes: { elemMatch: { uri: { eq: $taxonomyUri } } } }
      }
      sort: { fields: [date], order: DESC }
    ) {
      nodes {
        excerpt
        uri
        title
      }
    }
  }
`
```

:::

::: hsbox `gatsby-node.ts`

```typescript
import type { GatsbyNode } from 'gatsby'
import path from 'path'

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql, reporter }) => {
	const gatsbyUtilities = { actions, graphql, reporter }
  const categoryData = await getCategoryData(gatsbyUtilities)
  await createTaxonomyPage(categoryData, gatsbyUtilities)
}

async function getCategoryData(gatsbyUtilities: any) {
  const { graphql, reporter } = gatsbyUtilities
  const graphqlResult = await graphql(/* GraphQL */ `
    query WpCatPosts {
      allWpPost(sort: { fields: date, order: DESC }) {
        group(field: categories___nodes___id) {
          fieldValue
          totalCount
        }
      }
      allWpCategory {
        nodes {
          id
          uri
          name
          description
        }
      }
    }
  `)

  if (graphqlResult.errors) {
    reporter.panicOnBuild('There was an error loading your blog posts by category', graphqlResult.errors)
  }

  return graphqlResult.data
}

async function createTaxonomyPage( taxonomyData: any, gatsbyUtilities: any) {
  const taxonomyNodes = taxonomyData.allWpCategory.nodes
  const _groups = taxonomyData.allWpPost.group
  const taxonomies = taxonomyNodes.map((node: any) => ({
    ...node, ..._groups.find((g: any) => g.fieldValue === node.id)
  })).filter((node: any) => node.totalCount)
  const taxonomyTemplate = path.resolve('./src/templates/template-category.tsx')

  return Promise.all(
    taxonomies.map(async (taxonomy: any) => {
      const taxonomyName = taxonomy.name
      const taxonomyDescription = taxonomy.description
      const taxonomyUri = taxonomy.uri

      return gatsbyUtilities.actions.createPage({
        path: taxonomyUri,
        component: taxonomyTemplate,
        context: {
          taxonomyUri: taxonomyUri,
          taxonomyName: taxonomyName
        },
      })
    })
  )
}
```

:::

::: tip

Make the same things for tag and author pages.

:::



### Pagination

The sample codes in the previous section are for creating a full-size category page. In other words, it creates a page that contains all the posts in that category. If you have a site with many posts, you can split the category page into multiple pages, for example,  `/category/math/page/1/`.

**Main idea**: in `gatsby-node.ts`, we will not create just one page, but determine how many pages we will create. For each page, we need the index of the post we start with (`offset`), the number of posts on that page (`postsPerPage`) and finally the uri of the page (`/category/math` for the first page and `/category/math/page/i` for pages 2, 3, ...).

::: hsbox Modify `gatsby-node.ts`

```typescript
// Keep like previous section
async function createTaxonomyPage( taxonomyData: any, gatsbyUtilities: any) {
	// ...
  return Promise.all(
  	taxonomies.map(async (taxonomy: any) => {
      const taxonomyUri = taxonomy.uri
      const taxonomyNumberOfPosts = taxonomy.totalCount
      const totalPages = Math.ceil(taxonomyNumberOfPosts / postsPerPage)

      const subPromises = []

      for (let i = 0; i < totalPages; i++) {
        const pageNumber = i + 1
        const getPagePath = (page: any, taxUri: string) => {
          if (page > 0 && page <= totalPages) {
            return page === 1 ? taxUri : `${taxUri}page/${page}/`
          }
          return null
        }
        subPromises.push(
          gatsbyUtilities.actions.createPage({
            path: getPagePath(pageNumber, taxonomyUri),
            component: taxonomyTemplate,
            context: {
              offset: i * postsPerPage,
              postsPerPage,
              taxonomyUri: taxonomyUri,
              taxonomyName: taxonomyName,
              taxonomyDescription: taxonomyDescription,
              totalPages: totalPages,
              currentPage: pageNumber,
            },
          })
        )
      }
      return await Promise.all(subPromises)
    })
  )
}
```

:::

::: hsbox Modify `src/templates/template-category.tsx`

```tsx
export const pageQuery = graphql`
  query WPCategoryPosts($taxonomyUri: String, $offset: Int, $postsPerPage: Int) {
    allWpPost(
      filter: {
        categories: { nodes: { elemMatch: { uri: { eq: $taxonomyUri } } } }
      }
      sort: { fields: [date], order: DESC }
      limit: $postsPerPage
      skip: $offset
    ) {
      nodes {
        excerpt
        uri
        title
      }
    }
  }
`
```

:::

Before modifying the `taxonomy.tsx` file, you need to create a component for the pagination like below,

::: hsbox `src/components/pagination.tsx`

This component returns a layout of pagination like this,

>  Pagination: First Previous 4 5 **6** 7 8 Next Last

```tsx
import * as React from 'react'
import { Link } from 'gatsby'

export default function Pagination(props) {
  const { path, total, current } = props
  return (
    <div className='pagination-container'>
      <span>Pagination:</span>
      {current > 3 && (<Link to={path}>First</Link>)}

      {current > 1 && (<Link to={getPagePath(current - 1, path)}>Previous</Link>)}
      {current > 2 && (<Link to={getPagePath(current - 2, path)}>{current - 2}</Link>)}
      {current > 1 && (<Link to={getPagePath(current - 1, path)}>{current - 1}</Link>)}

      {<span style="font-weight: bold;">{current}</span>}

      {total - current > 0 && (<Link to={getPagePath(current + 1, path)}>{current + 1}</Link>)}
      {total - current > 1 && (<Link to={getPagePath(current + 2, path)}>{current + 2}</Link>)}
      {total - current > 0 && (<Link to={getPagePath(current + 1, path)}>Next</Link>)}

      {total - current > 2 && (<Link to={getPagePath(total, path)}>Last</Link>)}
    </div>
  )
}

const getPagePath = (pageNumber: number, taxUri: string) =>
  pageNumber === 1 ? taxUri : `${taxUri}page/${pageNumber}/`
```

:::

::: hsbox Modify `src/layouts/taxonomy.tsx`

Insert the `Pagination` component into it,

```tsx
<Pagination
  path={context.taxonomyUri}
  total={context.totalPages}
  current={context.currentPage}
/>
```

:::



## Individual pages

**Method 1**: Your wordpress site has an About page (`/about/`), you need to create a corresponding file in `src/pages/`, i.e. `src/pages/about.tsx`. The same for other pages.

**Method 2**: An alternative way to do this automatically is to use `gatsby-node.ts`, as we do with category and tag. In `gatsby-node.ts`, we query all pages with their uri and the required data. We use this  information to create the appropriate pages. With this method, we do not have to manually create each file for each page in `src/pages/` as we do with Method 1.

::: hsbox `gatsby-node.ts`

```typescript
export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql, reporter }) => {
  /* add below */
	const pages = await getPages(gatsbyUtilities)
  if (pages.length) {
    await createIndividualPages(gatsbyUtilities, pages)
  }
}

const createIndividualPages = async (gatsbyUtilities: any, pages: any) =>
  Promise.all(
    pages
      .filter((node: any) => node.uri !== '/all/') /* Treat the page "/all/" differently */
      .map((node: any) =>
        gatsbyUtilities.actions.createPage({
          path: node.uri,
          component: path.resolve('./src/templates/template-page.tsx'),
          context: {
            id: node.id,
          },
        })
      )
  )

async function getPages(gatsbyUtilities: any) {
  const { graphql, reporter } = gatsbyUtilities
  const graphqlResult = await graphql(/* GraphQL */ `
    query GatsbyNodeWpPages {
      allWpPage(sort: { fields: [date], order: DESC }) {
        nodes {
          id
          uri
        }
      }
    }
  `)

  if (graphqlResult.errors) {
    reporter.panicOnBuild(
      'There was an error loading your blog posts',
      graphqlResult.errors
    )
  }

  return graphqlResult.data.allWpPage.nodes
}
```

:::



::: idea

Above codes in `gatsby-node.ts`, we manually ignore the `/all/` page with `pages.filer(node => node.uri !== '/all/')`. We can do better than that by creating a new field in the WP, say "createDifferent" using ACF and then ignore it in `gatsby-node.ts` via the GraphQL query.

::: hsbox Modify the codes in `gatsby-node.ts` like this

```diff-typescript
// function "getPages()"
query GatsbyNodeWpPages {
  allWpPage(
    sort: { fields: [date], order: DESC }
+    filter: { pageCustomField: { createdifferent: { ne: true } } }
    ) {
      nodes {
        id
        uri
      }
    }
}

// function "createIndividualPages()"
    pages
-      .filter((node: any) => node.uri !== '/all/')
      .map((node: any) =>
```

:::



::: hsbox `src/templates/template-page.tsx`

```tsx{% raw %}
import * as React from 'react'
import { graphql } from 'gatsby'
import Page from '../layouts/page'

export default function IndividualPage(props) {
  return (
    <div>
      <h1 className="text-2xl">This is {props.data.wpPage?.title}</h1>
      {props.data.wpPage?.content && (
        <div
          className="content mt-8"
          dangerouslySetInnerHTML={{ __html: props.data.wpPage?.content }}
        />
      )}
    </div>
  )
}

export const pageQuery = graphql`
  query IndividualPageById($id: String!) {
    wpPage(id: { eq: $id }) {
      id
      content
      title
      date(formatString: "DD/MM/YYYY")
  }
`
{% endraw %}
```

:::



## Individual posts

Let us make the most important part, a post template. This is the one displaying your post content when you browser its URL. The idea is almost the same as in previous sections. We start from `gatsby-node.ts` to get the list of posts with their neccessary information (uri, id, its brother posts' information,...). These informations will be parsed to `createPage()` and be coupled with `template-post.tsx` to generate the post. Below are the main codes.

::: hsbox `gatsby-node.ts`

```typescript
export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql, reporter }) => {
  /* Add below */
  const posts = await getPosts(gatsbyUtilities)
  if (posts.length) await createIndividualPostPages(gatsbyUtilities, posts)
}

const createIndividualPostPages = async ( gatsbyUtilities: any, posts: any ) =>
  Promise.all(
    posts.map((edge: any) =>
      gatsbyUtilities.actions.createPage({
        path: edge.post.uri as string,
        component: path.resolve('./src/templates/template-post.tsx'),
        context: {
          id: edge.post.id,
          previousPostId: edge.previous ? edge.previous.id : null,
          nextPostId: edge.next ? edge.next.id : null,
        },
      })
    )
  )

async function getPosts( gatsbyUtilities: any ): Promise<GatsbyNodePosts> {
  const { graphql, reporter } = gatsbyUtilities
  const graphqlResult = await graphql(/* GraphQL */ `
    query GatsbyNodeWpPosts {
      allWpPost(sort: { fields: [date], order: DESC }) {
        edges {
          previous {
            id
          }
          post: node {
            id
            uri
          }
          next {
            id
          }
        }
      }
    }
  `)
```

:::

::: hsbox `src/templates/template-post.tsx`

```tsx {% raw %}
import * as React from 'react'
import { graphql } from 'gatsby'

export default function PostTemplate(props) {
  const { previous, next, post } = props.data
  return (
    <div class="container">
      <article>
        <header>
          <h1>{parse(post?.title ?? 'No title')}</h1>
          <p>{post?.date}</p>
        </header>

        {!!post?.content && (
          <section>
          	<div dangerouslySetInnerHTML={{ __html: post.content }} />
          </section>
        )}

        <hr />

        <footer>This is a footer!</footer>
      </article>

      <nav>
        <ul>
          <li>
            {previous && (
              <Link to={previous.uri as string} rel="prev">
                ← {parse(previous.title as string)}
              </Link>
            )}
          </li>

          <li>
            {next && (
              <Link to={next.uri as string} rel="next">
                {parse(next.title as string)} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostById(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    post: wpPost(id: { eq: $id }) {
      id
      content
      title
      date(formatString: "DD/MM/YYYY")
    }
    previous: wpPost(id: { eq: $previousPostId }) {
      uri
      title
    }
    next: wpPost(id: { eq: $nextPostId }) {
      uri
      title
    }
  }
`
{% endraw %}
```

:::

::: tip

To apply TailwindCSS to the components of posts (fonts, texts, spacing, tables, links,...), go to [this section](#styling-the-post's-components).

:::

## Make a search page

👉 Read this article: ["Native Search vs. Jetpack Instant Search in Headless WordPress With Gatsby" by CSS-Tricks](https://css-tricks.com/native-search-vs-jetpack-instant-search-in-headless-wordpress-with-gatsby/), below are the main parts.

You can go to WP admin > GraphiQL IDE and try

```graphql
query pageCategory {
  posts(where: {search: "toán"}) {
    nodes {
      title
    }
  }
}
```

::: warning

There is no `posts` on Gatsby GraphQL IDE (`localhost:8000/___graphql`)!

:::

Yes! WPGraphQL offers a way to search the posts by keywords. In order to communicate directly with our WPGraphQL API, we will install [Apollo Client](https://www.apollographql.com/docs/react/get-started/); it takes care of requesting and caching the data as well as updating our UI components.

```bash
npm i @apollo/client cross-fetch
```

::: info

Please check Apollo's pricing page to see [what the free query volume is (maximum monthly)](https://www.apollographql.com/pricing).

:::

::: hsbox `gatsby-browser.ts`

```typescript
import React from 'react'
import fetch from 'cross-fetch'

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client'

const cache = new InMemoryCache()
const link = new HttpLink({
  /* Set the endpoint for your GraphQL server, (same as in gatsby-config.js) */
  uri: process.env.GRAPHQL_ENDPOINT_URL,
  /* Use fetch from cross-fetch to provide replacement for server environment */
  fetch,
})
const client = new ApolloClient({
  link,
  cache,
})
export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)
```

:::

::: hsbox `src/components/search-form.tsx`

```tsx {% raw %}
import React, { useState, useRef } from 'react'

type SearchResultsProps = {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export default function SearchForm(props: SearchResultsProps) {
  const { searchTerm, setSearchTerm } = props
  const [value, setValue] = useState(searchTerm)
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setSearchTerm(value)
  }
  const searchInput = useRef(null)
  return (
    <form role="search" onSubmit={handleSubmit}>
      <input
        id="search"
        type="search"
        ref={searchInput}
        value={value}
        placeholder="Type to search..."
        autoComplete="off"
        onChange={e => setValue(e.target.value)}
      />
      <button type="submit">
        <i className="icon-search" style={{ fontSize: 20 }} />
      </button>
    </form>
  )
}
{% endraw %}
```

:::

::: hsbox `src/components/search-results.tsx`

```tsx
import React from 'react'
import { Link } from 'gatsby'
import { useQuery, gql } from '@apollo/client'

const GET_RESULTS = gql`
  query ($searchTerm: String) {
    posts(where: { search: $searchTerm }) {
      edges {
        node {
          id
          uri
          title
          excerpt
        }
      }
    }
  }
`

type SearchResultsProps = {
  searchTerm: string
}

export default function SearchResults(props: SearchResultsProps) {
  const { data, loading, error } = useQuery(GET_RESULTS, {
    variables: { searchTerm: props.searchTerm },
  })
  if (loading) return <p>Searching posts for {props.searchTerm}...</p>
  if (error) return <p>Error - {error.message}</p>
  return (
    <section className="search-results">
      <h2>
        Found {data.posts.edges.length} results for {props.searchTerm}:
      </h2>
      <ul>
        {data.posts.edges.map((el: any) => {
          return (
            <li key={el.node.id}>
              <Link to={el.node.uri}>{el.node.title}</Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

::: tip

If you have linting problems with "posts", you can change the line `GET_RESULTS` like this,

```tsx
const gqlIgnoreError = gql
const GET_RESULTS = gqlIgnoreError`
	query ($searchTerm: String) {
```

:::

::: hsbox A search page (`/search/`) at `src/pages/search.tsx`

```tsx
import React, { useState } from 'react'
import SearchForm from '../components/search-form'
import SearchResults from '../components/search-results'
import Page from '../layouts/page'

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <Page>
      <div className="p-8">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {searchTerm && <SearchResults searchTerm={searchTerm} />}
      </div>
    </Page>
  )
}
```

:::

Then go to *http://localhost:8000/search/* to test the results.

### Connect to the search field in the navigation

If you have an input field in the navigation bar (menu bar, as with our website), you want the keywords to be sent to the search page and the results to be displayed there (same behavior as with the normal WP site).

::: hsbox In `src/components/navigation.tsx`

```tsx
import React, { useRef, useState } from 'react'

export default function Navigation(props: NavigationProps) {
	const [valueSearch, setValueSearch] = useState('')
  const searchInput = useRef(null)

  return (
  	<>
    	<form
        onSubmit={event => {
          event.preventDefault()
          navigate(`/search/?s=${encodeURI(valueSearch)}`)
        }}
        >
      <button type="submit">Search</button>
      <input
        id="search"
        type="search"
        placeholder="search..."
        autoComplete="off"
        value={valueSearch}
        ref={searchInput}
        onChange={e => setValueSearch(e.target.value)}
        />
    </form>
    </>
  )
}
```

::: warning

Yes! We need `encodeURI()` to overcome the problem of special characters!

:::

::: hsbox In the search page `src/pages/search.tsx`

```tsx
export default function SearchPage() {
	const { search } = window.location
  const query = new URLSearchParams(search).get('s')
  const finalSearchTerm = decodeURI(query as string)

  return (
    <Page>
      <div className="p-8">
        {finalSearchTerm && <SearchResults searchTerm={finalSearchTerm} />}
      </div>
    </Page>
  )
}
```

:::



### Pagination for search results

By default, the WPGraphQL posts query returns 10 first posts; we need to do more if we want the results paginated into individual pages. Read [this post](https://css-tricks.com/native-search-vs-jetpack-instant-search-in-headless-wordpress-with-gatsby/#aa-paginated-queries) to learn how to do that.



## Popular posts

If you want to add popular posts (in a specific time period, based on the number of views), you can use the same method as in [the Search section](#make-a-search-page), except that we query `popularPosts` in the GraphiQL IDE in WP Admin. Like this,

```graphql
{
  popularPosts(first: 10) {
    nodes {
      id
      title
      date
    }
  }
}
```

However, the default settings for WPGraphQL do not support the `popularPosts` field. You need to add [the appropriate codes (on wpgraphqldocs)](https://wpgraphqldocs.gatsbyjs.io/recipes/popular-posts/) in the `functions.php` file of the WP theme (In WP Admin > Appearance > Theme File Editor > Theme Functions (*functions.php*)).

::: tip

If the codes from wpgraphqldocs do not work, modify,

```php
// this line
'meta_key' => 'wpb_post_views_count',
// to this one
'meta_key' => 'views',
```

:::



## Related posts

[This nice article](https://www.polynique.com/web-development/add-related-posts-component-to-gatsby-wordpress/#related-posts-schema) gives us a way to get related posts of a post via GraphQL query. Depending on the changes to Gatsby and WPGraphQL, the codes in this article no longer work. Below you will find my customizations (without explanations).

First, install the WP plugins **Yet Another Related Posts Plugin (YARPP)**, **WP REST Cache** (optional). After you have installed and activated these plugins, go to YARPP settings and change all the options you want there, just make sure that:

- "*Automatically display related content on*" is **unchecked for all options**.
- "*Display related posts in REST API?*" is **checked**.

::: hsbox `gatsby-node.ts`

``` typescript
export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  async ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
    type WpPost implements Node {
      relatedPosts: WpNodePost!
    }

    type WpNodePost implements Node {
      nodes: [WpPost]
    }
  `
    createTypes(typeDefs)
  }

export const createResolvers: GatsbyNode['createResolvers'] = async ({
  createResolvers,
}) =>
  createResolvers({
    WpPost: {
      relatedPosts: {
        resolve: async (source: any, args: any, context: any, info: any) => {
          const { databaseId } = source
          const response = await fetch(
            `${process.env.WORDPRESS_BASE}/wp-json/yarpp/v1/related/${databaseId}?limit=5`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*',
                'User-Agent': '*',
              },
            }
          ).then(async res => (res.status === 200 ? await res.json() : []))
          if (response && response.length) {
            const { entries } = await context.nodeModel.findAll({
              query: {
                filter: {
                  databaseId: { in: response.map(({ id }: { id: any }) => id) },
                },
              },
              type: 'WpPost',
            })
            return { nodes: entries }
          } else return { nodes: [] }
        },
      },
    },
  })
```

For `process.env.WORDPRESS_BASE`, read [this section](#setting-up-.env).

Here, in the API URL, I have set `?limit=5` which means we will only get 5 related posts to the current post. Besides the `limit`, you can also check other options for the YARPP REST API [here](https://support.shareaholic.com/hc/en-us/articles/360046456752).

:::

::: hsbox A testing query in *http://localhost:8000/___graphql*

```graphql
{
  allWpPost(limit: 1) {
    nodes {
      title
      relatedPosts {
        nodes {
          title
          uri
        }
      }
    }
  }
}
```

:::

Then add related posts to the post template (look at [this section](#individual-posts) again).

::: hsbox Modify `src/templates/template-post.tsx`

```tsx
export default function PostTemplate() {
  const { previous, next, post } = props.data
  return (
    /* ... */
    <h2>Related posts</h2>
    <ul>
      {post?.relatedPosts?.nodes?.map(el => {
        return (
          <li key={el?.id as string}>
            <Link to={el?.uri as string}>{el?.title}</Link>
          </li>
        )
      })}
    </ul>
    /* ... */
  )
}

export const pageQuery = graphql`
  query BlogPostById(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    post: wpPost(id: { eq: $id }) {
      id
      excerpt
      content
      title
      date(formatString: "DD/MM/YYYY")
      relatedPosts {
        nodes {
          title
          uri
          id
        }
      }
 // ....
```

:::

## Styling the post's components

Again, this post does not include any styles from the current version of Math2IT. This section shows you how to use TailwindCSS to style the content of your post.

Install [Tailwind's typography plugin](https://tailwindcss.com/docs/typography-plugin) and read its documentation. The most important point is to add the `prose` class to the wrapper of the post.

And one more thing: If you have some custom plugins installed in your WP site and they create custom classes, like `<div class="custom-class-from-plugin">`, you need to define this class in your theme.



## Table of contents for a post

I found [this wonderful article](https://www.polynique.com/web-development/how-to-add-a-table-of-contents-toc-to-gatsby-wordpress/). You can follow the steps in this article to make "toc" appear in the GraphQL query.

```graphql
query MyQuery {
  allWpPost(limit: 10) {
    nodes {
      id
      title
      toc
    }
  }
}
```

You can modify `template-post.tsx` as follows to show the TOC only if the post contains more than 4 headings.

```tsx
import { get } from 'lodash'

export default function PostTemplate(props: SinglePostProps) {
  // ... other codes
  return (
  	<h2 className="text-xl">TOC</h2>
    {get(post, 'toc.items.length') > 4 && (
      <ul>
        {get(post, 'toc.items').map((item: any) => (
          <li key={item.url}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    )}
  )
  // ... other codes
}
```

## Lazyload and Responsively Serve Images

### Images from WP hosting

Images hosted on WP are handled well by `gatsby-source-wordpress` plugin. You don't have to worry much about this type of images.

### External images

You can use an external source to serve your images and insert the links into the WP posts, instead of uploading them directly to  WP hosting. In this case, how can we ensure that these images are lazyload and responsive? [Surinder Bhomra's article](https://www.surinderbhomra.com/Blog/2020/02/07/Lazyload-Responsively-Serve-External-Images-Gatsby) is a good reference for dealing with an external image, but with the condition that you need to use a custom component like `LazyloadImage` for each image. This does not work with the links in the WP posts.

It's good if we can "parse" the `post.content` and replace all `img` tags with the above mentioned `LazyloadImage` component. Let's do it this way. Read Surinder's article if you want to understand the basic ideas of creating and using the `LazyloadImage` component.

Note that I changed his codes to match TypeScript syntax and also to be compatible with [**imgur**](https://imgur.com/)'s image URLs (I host my images on **imgur**, while he hosts his on [imagekit](http://imagekit.io/)).

First we need to install the [`react-visibility-sensor`](https://www.npmjs.com/package/react-visibility-sensor) plugin.

::: hsbox `src/components/visibility-sensor.tsx`

```tsx {% raw %}
import React, { useState } from 'react'
import VSensor from 'react-visibility-sensor'

type VisibilitySensorProps = {
  once?: boolean
  children: (arg0: { isVisible: any }) => any
}

export default function VisibilitySensor(props: VisibilitySensorProps) {
  const [active, setActive] = useState(true)

  const { once, children, ...theRest } = props
  return (
    <VSensor
      active={active}
      onChange={(isVisible: any) => once && isVisible && setActive(false)}
      {...theRest}
    >
      {({ isVisible }: { isVisible: any }) => children({ isVisible })}
    </VSensor>
  )
}
{% endraw %}
```

:::

::: hsbox `src/components/lazy-load-image.tsx`

```tsx {% raw %}
import React from 'react'
import VisibilitySensor from './visibility-sensor'

/* Change this if you use services other than imgur. */
type ImgurSize = 't' | 'm' | 'l' | 'h' | 'o' // sizes for imgur images (except 'o' which is my custom size)

type LazyloadImageProps = {
  src: string
  alt?: string
  sizes?: string
  srcsetSizes?: {
    imageWidth: ImgurSize
    viewPortWidth: number
  }[]
}

const defaultProps: LazyloadImageProps = {
  alt: '',
  sizes: '100vw',
  src: '',
  srcsetSizes: [
    { imageWidth: 't', viewPortWidth: 160 },
    { imageWidth: 'm', viewPortWidth: 320 },
    { imageWidth: 'l', viewPortWidth: 640 },
    { imageWidth: 'h', viewPortWidth: 1024 },
    { imageWidth: 'o', viewPortWidth: 1366 },
  ],
}

export default function LazyloadImage(
  props: LazyloadImageProps = defaultProps
) {
  let srcSetAttributeValue = ''
  const sanitiseImageSrc = props.src.replace(' ', '%20')
  const srcsetSizes = props.srcsetSizes || defaultProps.srcsetSizes

  if (srcsetSizes) {
    for (let i = 0; i < srcsetSizes.length; i++) {
      srcSetAttributeValue += `${getImageUrl(
        sanitiseImageSrc,
        srcsetSizes[i].imageWidth
      )} ${srcsetSizes[i].viewPortWidth}w`
      if (srcsetSizes.length - 1 !== i) {
        srcSetAttributeValue += ', '
      }
    }
  }

  const visibilitySensorProps = {
    partialVisibility: true,
    key: sanitiseImageSrc,
    delayedCall: true,
    once: true,
  }

  return (
    <VisibilitySensor {...visibilitySensorProps}>
      {({ isVisible }) => (
        <>
          {isVisible ? (
            <img
              src={`${sanitiseImageSrc}`}
              alt={props.alt}
              sizes={
                props.sizes ||
                `(min-width: 1366px) 1366px, ${defaultProps.sizes}`
              }
              srcSet={srcSetAttributeValue}
              loading="lazy"
            />
          ) : (
            <img src={`${sanitiseImageSrc}`} alt={props.alt} />
          )}
        </>
      )}
    </VisibilitySensor>
  )
}

function getImageUrl(originalImageUrl: string, size: ImgurSize) {
  /**
   * https://i.imgur.com/CBEDn0j.jpg
   * becomes
   * https://i.imgur.com/CBEDn0jt.jpg
   */
  const ar = originalImageUrl.split('.')
  return size === 'o'
    ? originalImageUrl
    : ar.slice(0, ar.length - 1).join('.') + `${size}.` + ar[ar.length - 1]
}
{% endraw %}
```

:::

And then, modify the post template,

::: hsbox `src/templates/template-post.tsx`

```tsx {% raw %}
// OLD:
// <div dangerouslySetInnerHTML={{ __html: post.content }} />

// NEW
import parse from 'html-react-parser'
// other codes
<div>{parse(post.content,{ replace: replaceMedia })}</div>
{% endraw %}
```

```tsx {% raw %}
const getImage = (node: any) => {
  if (node.name === 'img') {
    return node
  } else if (node.children != null) {
    for (let index = 0; index < node.children.length; index++) {
      const image = getImage(node.children[index]) as any
      if (image != null) return image
    }
  }
}

const replaceMedia = (node: any) => {
  if (node.name === 'figure' && doesNodeContainsTag(node, 'img') !== -1) {
    const figureClasses = node.attribs.class
    const image = getImage(node)
    const figCaption =
      doesNodeContainsTag(node, 'figcaption') !== -1
        ? node.children[doesNodeContainsTag(node, 'figcaption')].children[0]
            .data
        : null
    if (image != null) {
      return (
        <figure className={figureClasses}>
          <LazyloadImage src={image.attribs.src} alt={image.attribs.alt} />
          {figCaption && <figcaption>{figCaption}</figcaption>}
        </figure>
      )
    }
    return node
  }
}

function doesNodeContainsTag(node: any, tag: string): number {
  if (node.children != null) {
    for (let index = 0; index < node.children.length; index++) {
      if (node.children[index].name === tag) {
        return index
      }
    }
  }
  return -1
}
{% endraw %}
```

:::

## Comment system

For a comment system you need "two-way" directions". One direction is to retrieve all comments from the WP database and the other direction is to publish a new comment to the WP database. The former is easy via the GraphQL with the query `allWpComment` or `WpComment` (see http://localhost:8000/___graphql), just like `WpPost`. The latter is  more difficult. In this post, I have not found a solution yet ([let me know](mailto:me@dinhanhthi.com) if you have one).

Another option for you is to use comment systems for static websites. You can find a list of comment systems in [the Gatsby documentation](https://www.gatsbyjs.com/docs/how-to/adding-common-features/adding-comments/).



## Deployment

The "incremental build" = every time you update your website (both styles and WP content), the website automatically detects this and rebuilds it. The special thing about this is that the website only rebuilds the parts of the website that have changed.

As far as I know, the only way to deploy the site in the "incremental build" style is to use **[Gatsby Cloud](https://www.gatsbyjs.com/products/cloud/)**, which is not free.

::: tip

If you want a free version of "incremental build", consider **[Next.JS](https://nextjs.org/)** (another React SSG framework)

:::

One idea for you is to build your site locally and upload the created folder to Github. Then use a service like [**Netlify**](https://www.netlify.com/) or **[Vercel](https://vercel.com/)** to freely host your site. ==I prefer Vercel with more bandwidth and build time for free tiers==.

If you want to reduce the size of your WP site and also optimize it, read [this note](/wordpress-cleanup-and-optimize/).



## Useful GraphQL queries

::: hsbox All non-empty categories

```graphql
query myQuery {
  allNonEmptyCategories: allWpCategory(filter: { count: { gt: 0 } }) {
    nodes {
      id
      name
      uri
      count
    }
    totalCount
  }
}
```

:::

::: hsbox All non-empty tags

```graphql
query myQuery {
  allNonEmptyTags: allWpTag(filter: { count: { gt: 0 } }) {
    nodes {
      id
      name
      uri
      count
    }
    totalCount
  }
}
```

:::

::: hsbox All users

```graphql
query myQuery {
	allWpUser {
    nodes {
      id
      uri
      name
    }
    totalCount
  }
}
```

:::

::: hsbox List of posts (with limit)

```graphql
query myQuery {
	listPosts: allWpPost(sort: { fields: [date], order: DESC }, limit: 5) {
    nodes {
      excerpt
      uri
      date(formatString: "MMMM DD, YYYY")
      title
    }
  }
}
```

:::

::: hsbox All individual pages

```graphql
query myQuery {
  allWpPage {
    nodes {
      uri
      title
    }
  }
}
```

:::

::: hsbox Images

```graphql
featuredImage {
  node {
    altText
    localFile {
      childImageSharp {
        gatsbyImageData(
          quality: 100
          placeholder: TRACED_SVG
          layout: FULL_WIDTH
        )
      }
    }
  }
}
```



:::

## Troubleshooting

::: hsbox The tag `<sometag>` is unrecognized in this browser

If you have a custom HTML tag in your WP post content, for example `<tpink>`, an error is displayed,

```bash
The tag <tpink> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
```

If you want to fix the problam and change all `<tpink>` to `<span class="tpink">`, you can change the `template-posts.tsx`,

```tsx
post.content
  .replaceAll('<tpink>', '<span class="tpink">')
  .replaceAll('</tpink>', '</span>')
```

:::
