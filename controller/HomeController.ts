import axios from "axios";
import * as cheerio from "cheerio";
import express, { Request, Response } from "express";

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
          image: $(this)?.find("a img").attr("lazysrc"),
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
};

export default HomeController;
