import axios from "axios";
import * as cheerio from "cheerio";
import express, { Request, Response } from "express";
import { parse } from "node-html-parser";

interface TruyenHotType {
  slug?: string;
  name?: string;
  image?: string;
}

interface TruyenType {
  name?: string;
  slug?: string;
}

interface Chapter {
  name?: string;
  slug?: string;
}

interface TruyenDaHoanThanhType {
  slug?: string;
  name?: string;
  image?: string;
  chapter?: string;
}

interface TruyenMoiCapNhatType {
  slug?: string;
  name?: string;
  category?: TruyenType[];
  currentChapter?: Chapter;
  time?: string;
}

interface TruyenListType {
  slug?: string;
  name?: string;
  currentChapter?: Chapter;
  image: string;
  author: string;
}

const HomeController = {
  getTruyenHot: async (req: Request, res: Response) => {
    const url = `${process.env.URL}`;
    try {
      const html = await axios(url);
      const $ = cheerio.load(html.data);
      const mangas: TruyenHotType[] = [];
      $("#intro-index .index-intro .item").each(function () {
        let manga: TruyenHotType = {
          slug: $(this)?.find("a").attr("href")?.split("truyenfull.vn/")[1],
          image:
            $(this)?.find("a img").attr("lazysrc") ||
            $(this)?.find("a img").attr("src"),
          name: $(this)?.find("a div h3").text(),
        };
        mangas.push(manga);
      });
      return res.json(mangas);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server");
    }
  },
  getTruyenMoiCapNhat: async (req: Request, res: Response) => {
    const url = `${process.env.URL}`;
    try {
      const html = await axios(url);
      const $ = cheerio.load(html.data);
      const mangas: TruyenMoiCapNhatType[] = [];
      $("#list-index .list-new .row").each(function () {
        let manga: TruyenMoiCapNhatType = {
          slug: $(this)
            .find(".col-title h3 a")
            .attr("href")
            ?.split("truyenfull.vn/")[1],
          name: $(this).find(".col-title h3 a").text(),
          time: $(this).find(".col-time").text(),
          currentChapter: {
            slug: $(this)
              .find(".col-chap a")
              .attr("href")
              ?.split("truyenfull.vn/")[1],
            name: $(this).find(".col-chap a").text(),
          },
        };
        const genres: TruyenType[] = [];
        $(this)
          .find(".col-cat a")
          .each(function () {
            const genre: TruyenType = {
              name: $(this).text(),
              slug: $(this).attr("href")?.split("the-loai/")[1],
            };
            genres.push(genre);
          });
        mangas.push({ ...manga, category: genres });
      });
      return res.json(mangas);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server");
    }
  },
  getTruyenDaHoanThanh: async (req: Request, res: Response) => {
    const url = `${process.env.URL}`;
    try {
      const html = await axios(url);
      const $ = cheerio.load(html.data);
      const mangas: TruyenDaHoanThanhType[] = [];
      $("#truyen-slide div .row .col-xs-4").each(function () {
        let manga: TruyenDaHoanThanhType = {
          slug: $(this).find("a").attr("href")?.split("truyenfull.vn/")[1],
          image: $(this).find("a .lazyimg").attr("data-desk-image") || "",
          name: $(this).find("a .caption h3").text(),
          chapter: $(this).find("a .caption small").text(),
        };
        mangas.push(manga);
      });
      return res.json(mangas);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server");
    }
  },
  getList: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json("Missing id");
    }
    try {
      const url = `${process.env.URL}/danh-sach/${id}`;
      const html = await axios(url);
      const root = parse(html.data);

      const mangas: TruyenListType[] = [];

      root
        .querySelectorAll(".list-truyen .row")
        .forEach((item: any, index: number) => {
          if (index < 12) {
            const manga: TruyenListType = {
              image:
                item
                  .querySelector(".col-xs-3 .lazyimg")
                  .getAttribute("data-image") ||
                item
                  .querySelector(".col-xs-3 .lazyimg")
                  .getAttribute("data-desk-image"),
              name: item.querySelector(".col-xs-7 div h3 a").innerText,
              slug: item
                .querySelector(".col-xs-7 div h3 a")
                .getAttribute("href")
                .split(process.env.URL)[1],
              author: item.querySelector(".col-xs-7 .author").innerText,
              currentChapter: {
                name: item.querySelector(".col-xs-2 div a").innerText,
                slug: item
                  .querySelector(".col-xs-2 div a")
                  .getAttribute("href")
                  .split(process.env.URL)[1],
              },
            };
            if (manga.image) {
              mangas.push(manga);
            }
          }
        });

      return res.json(mangas);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server");
    }
  },
};

export default HomeController;
