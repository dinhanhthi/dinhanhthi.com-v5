---
layout: post
title: "Wordpress: Cleanup and Optimization tips"
tags: [Web Dev, Wordpress, CMS]
toc: true
icon: "wordpress.svg"
keywords: "clean up clenup optimization optimize resize reduce"
---

👉 Note: [All Wordpress notes](/tags/wordpress/).

## Turn off auto-generating thumbnails for images

When you upload an image to the WP Media Library, all the "neccessary" thumbnails (of various sizes and scales) are automatically generated, depending on your WP site settings and the theme you are using.

I use [reGenerate Thumbnails Advanced](https://wordpress.org/plugins/regenerate-thumbnails-advanced/) to regenerate all of the current images on my site and remove all of the thumbnails. To prevent the generation when you upload new images in the future, you can use the [Stop Generating Unnecessary Thumbnails](https://wordpress.org/plugins/image-sizes/) plugin.

## Resize and compress the featured images

When you upload an image to the WP Library, this image can be very large (in MB). It's recommended to resize and compress the image before uploading it to your site, but what about the images you have already uploaded?

I use [`imagemagick`](https://imagemagick.org/) to shrink the images to a maximum width and height of 1280x1080 and skip images that are below this value.

Resize all the images in the current folder and put the new images in `./out/`

```bash
magick mogrify -path out -resize 1280x1080\> *
```

In order to compress the images, you can use [iloveimg](https://www.iloveimg.com/compress-image) website.

## Take all originally featured images from subfolders

If WP Amin > Settings > Media > "Organize my uploads into month- and year-based folders" is enabled (normally this option is enabled by default), every time you upload a new image, it will be placed in a subfolder like `2022/09/21/`. So, if you want to find a featured image of a post to resize and compress it, you need to know which folder it belongs to.

Use the following Python script to move all images in subfolders to a new folder,

```python
# copy_source_images.py
import shutil
import sys
import os
import re

def copy_source_images(path, path_copied):
    """
    Copy all images in folders/subfolders whose name not end with "???x???" to a new folder
    """
    for root, _, files in os.walk(path):
        for name in files:
            if not re.match('.*-[0-9]{1,4}x[0-9]{1,4}.*', name):
                file_full_path = os.path.abspath(os.path.join(root, name))
                rst = shutil.copy(file_full_path, path_copied)
                if (rst):
                    print(f'✅ Copied "{name}" to {path_copied}')

if __name__ == "__main__":
    copy_source_images(sys.argv[1], sys.argv[2])
```

How to use it?

```bash
python copy_source_images.py /home/thi/Downloads/
```

## Auto upload & attach & set featured images to posts

**Require**: posts are already attached with an featured image **name**. 

This is useful when doing the previous step (moving all featured images from subfolders to a new folder). Each post has the featured image's information attached (the name and the path of the image). If you change the path of this image (on disk), you must also change the path in the post's data. We can do this by the name of the image and the title of the post.

Uncheck  "Origanize my uploads in month- and year-based folders" in WP Admin > Settings > Media.

Get the list of posts with their data: WP Admin > GraphiQL IDE,

```graphql
{
  posts {
    nodes {
      databaseId
      title
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
}
```

Note that WPGraphQL is limited to a maximum of 100 nodes by default ([ref](https://wordpress.org/support/topic/graphiql-ide-get-more-results-in-query/)), follow [this guide](https://www.devtwins.com/blog/wpgraphql-increase-post-limit) to increase that limit. 

```php
// Add below code to functions.php
add_filter( 'graphql_connection_max_query_amount', function( $amount, $source, $args, $context, $info  ) {
    $amount = 1000; // increase post limit to 1000
    return $amount;
}, 10, 5 );
```

After retrieving the post data, you can save it in a `posts.json` file.

We need **[wp-cli](https://wp-cli.org/)** to attach an image to a post and set it as the feature image for that post.

```bash
wp media import --post_id=6804 --featured_image /Users/thi/Downloads/image.jpg
```

If you are using **[Local](https://localwp.com/)**, the **wp-cli** is already there (you just need to go to the site folder on your terminal or using Local > "Open site shell"). Otherwise, install wp-cli.

::: hsbox Install wp-cli, php, mysql on MacOS

```bash
brew install php
brew install mysql
brew install wp-cli

# check
wp --info
php --version
mysql --version
```

Connect to the current wordpress site running by Local (eg. `https://math2it.local`): On Local, go to Database tab > copy the "Socket" path and then create `wp-cli.local.yml` and `wp-cli.local.php` at `~/Local Sites/math2it`.

```yaml
# wp-cli.local.yml
path: app/public
require:
  - wp-cli.local.php
```

```php
// wp-cli.local.php
<?php
define('DB_HOST', 'localhost:/path/to/your/socket/mysqld.sock');
define('DB_USER', 'root');
define('DB_PASSWORD', 'root');

// Only display fatal run-time errors.
// See http://php.net/manual/en/errorfunc.constants.php.
error_reporting(1);
define( 'WP_DEBUG', false );
```

:::

The following script is an example. It automatically detects the name of the featured image attached to a post (in a list of posts `posts.json`) and attaches that image from the `uploads_resize_path` folder to that post with a new path.

```python
# assign_featured_images.py
import sys
import os
import json

json_path = '/Users/thi/Downloads/math2it/posts.json'
uploads_resize_path = '/Users/thi/Downloads/math2it/uploads_resize'
site_path = '/Users/thi/Local\ Sites/math2it/'

def main(fromIndex, toIndex):
    """
    Auto upload images to wordpress + assign featured images to posts
    """
    f = open(json_path, 'r')
    data = json.load(f)
    f.close()
    nodes = data['data']['posts']['nodes']
    total_posts = len(nodes)
    for idx, node in enumerate(nodes[int(fromIndex):int(toIndex)]):
        image_name = node['featuredImage']['node']['sourceUrl'].split(
            '/')[-1] if node['featuredImage'] else 'math.png'
        post_id = node['databaseId']
        post_title = node['title']
        cmd = f'wp media import --post_id={post_id} --featured_image {uploads_resize_path}/{image_name}'
        os.system(f'cd {site_path} && {cmd}')
        print(
            f'✅ [{idx + int(fromIndex)} / {total_posts}] Assigned featured image "{image_name}" to post "{post_title}"')

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
```

Use it?

```bash
# Upload post from index 5 to 16-1
python assign_featured_images.py 5 16
```

