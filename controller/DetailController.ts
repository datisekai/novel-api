import axios from "axios";
import { Response, Request } from "express";
import { parse } from "node-html-parser";
const DetailController = {
  detail: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(500).json("Missing id");
    }

    try {
      const url = `${process.env.URL}/${id}`;
      const html = await axios(url);
      const root = parse(html.data);

      const image = root.querySelector(".books .book img")?.getAttribute("src");
      const name = root.querySelector("h3.title")?.innerText;
      const description = root.querySelector(".desc .desc-text")?.innerText;
      const infos = root.querySelectorAll(".info div");
      const author = infos[0].querySelector("a")?.innerText;
      const categoriesHTML = infos[1].querySelectorAll("a");
      let categories: any = [];
      categoriesHTML.forEach((item: any) => {
        const category = {
          href: item
            .getAttribute("href")
            .split(`${process.env.URL}/the-loai/`)[1],
          name: item.innerText,
        };
        categories.push(category);
      });

      const source = infos[2].querySelector("span")?.innerText;
      const status = infos[3].querySelector("span")?.innerText;
      let totalPage = "";
      const paginationHTML = root.querySelectorAll(".pagination li");
      paginationHTML.forEach((item: any, index: number) => {
        if (index < paginationHTML.length - 1) {
          totalPage = item.toString().split("trang-")[1];
        }
      });

      let newChapters: any = [];

      root.querySelectorAll(".l-chapters li").forEach((item: any) => {
        newChapters.push({
          href: item
            .querySelector("a")
            .getAttribute("href")
            .split(`${process.env.URL}`)[1],
          name: item.querySelector("a").innerText,
        });
      });

      totalPage = totalPage.split("/#list-chapter")[0];

      let chapters: any = [];

      const results = await Promise.all(
        Array.from(Array(Number(totalPage ? totalPage : 1)).keys()).map(
          async (item: number) => {
            const currentURL = `${process.env.URL}/${
              (id as string).split("/chuong")[0]
            }/trang-${item + 1}/#list-chapter`;
            const currentHtml = await axios(currentURL);
            return parse(currentHtml.data);
          }
        )
      );

      results.forEach((item: any) => {
        item.querySelectorAll(".list-chapter li").forEach((element: any) => {
          chapters.push({
            href: element
              .querySelector("a")
              .getAttribute("href")
              .split(`${process.env.URL}`)[1],
            name: element.querySelector("a").innerText,
          });
        });
      });

      return res.json({
        image,
        name,
        description,
        source,
        status,
        categories,
        author,
        chapters: chapters.reverse(),
        newChapters,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server");
    }
  },
  read: async (req: Request, res: Response) => {
    const { id } = req.query;
    if (!id) {
      return res.status(500).json("Missing id");
    }
    try {
      const url = `${process.env.URL}/${id}`;
      const html = await axios(url);
      const root = parse(html.data);
      const content = root.querySelector("#chapter-c")?.innerHTML;
      let listChap: any = [];
      root.querySelectorAll(".chapter_jump option").forEach((item: any) => {
        listChap.push({
          href: item.getAttribute("value"),
          name: item.innerText,
        });
      });

      return res.json({
        html: content,
        name: root.querySelector(".truyen-title")?.innerText,
        currentChap: root.querySelector(".chapter-title")?.innerText,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server");
    }
  },
  chapter: async (req: Request, res: Response) => {
    const { id } = req.query;
    if (!id) {
      return res.status(500).json("Missing id");
    }
    try {
      const url = `${process.env.URL}/${(id as string).split("/chuong")[0]}`;
      const html = await axios(url);
      const root = parse(html.data);
      let totalPage = "";
      const paginationHTML = root.querySelectorAll(".pagination li");
      paginationHTML.forEach((item: any, index: number) => {
        if (index < paginationHTML.length - 1) {
          totalPage = item.toString().split("trang-")[1];
        }
      });

      let listChapter: any = [];

      let totalPageNumber = Number(totalPage.split("/#list-chapter")[0]);

      const results = await Promise.all(
        Array.from(Array(totalPageNumber).keys()).map(async (item: number) => {
          const currentURL = `${process.env.URL}/${
            (id as string).split("/chuong")[0]
          }/trang-${item + 1}/#list-chapter`;
          const currentHtml = await axios(currentURL);
          return parse(currentHtml.data);
        })
      );

      results.forEach((item: any) => {
        item.querySelectorAll(".list-chapter li").forEach((element: any) => {
          listChapter.push({
            href: element
              .querySelector("a")
              .getAttribute("href")
              .split(`${process.env.URL}`)[1],
            name: element.querySelector("a").getAttribute("title"),
          });
        });
      });

      listChapter = listChapter.reverse();

      return res.json(listChapter);
    } catch (err) {
      console.log(err);
      return res.status(500).json("Internal server");
    }
  },
};

export default DetailController;
