const EleventyFetch = require("@11ty/eleventy-fetch");
const { get, uniq } = require("lodash");
require("dotenv").config();

module.exports = async function () {
  let filter = {
    filter: {
      property: "11ty-share",
      checkbox: {
        equals: true,
      },
    },
  };

  // WEB
  let url = `https://api.notion.com/v1/databases/${process.env.NOTION_WEB_ID}/query`;
  let jsonWeb = await EleventyFetch(url, {
    duration: "3h",
    type: "json",
    fetchOptions: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_READ_TOKEN}`,
        "Notion-Version": `${process.env.NOTION_VERSION}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter),
    },
  });
  jsonWeb = transformData(jsonWeb.results, "web");

  // AI
  url = `https://api.notion.com/v1/databases/${process.env.NOTION_AI_ID}/query`;
  let jsonAI = await EleventyFetch(url, {
    duration: "3h",
    type: "json",
    fetchOptions: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_READ_TOKEN}`,
        "Notion-Version": `${process.env.NOTION_VERSION}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter),
    },
  });
  jsonAI = transformData(jsonAI.results, "ai");

  const json = [...jsonWeb, ...jsonAI];

  return {
    json,
  };
};

function transformData(data, type) {
  const defaultCategory = type === "web" ? "Web Dev" : "Deep Learning";
  const defaultDate = new Date().toISOString().split("T")[0];
  return data.map((post) => {
    const category = [
      get(post, "properties.11ty-category.select.name", defaultCategory),
    ];
    const tags = get(post, "properties.11ty-tags.multi_select", []).map(
      (tag) => tag.name
    );
    const finalTags = uniq([...category, ...tags]);
    const private = get(post, "properties.11ty-private.checkbox", false);
    const originalUrl = get(post, "url", "");
    const url = private
      ? originalUrl
      : originalUrl.replace(
          "https://www.notion.so",
          "https://thi-cs.notion.site"
        );
    return {
      title: get(post, "properties.Name.title[0].text.content", "Untitled"),
      url,
      tags: finalTags,
      keywords: get(
        post,
        "properties.11ty-keywords.rich_text[0].text.content",
        ""
      ),
      date: get(post, "last_edited_time", defaultDate).match(
        /\d{4}-\d{2}-\d{2}/
      )[0],
      inputPath: get(post, "properties.11ty-share-date.date.start")
        ? get(post, "properties.11ty-share-date.date.start")
        : get(post, "created_time", defaultDate),
      notfull: get(post, "properties.11ty-notfull.checkbox", false),
      private,
    };
  });
}
