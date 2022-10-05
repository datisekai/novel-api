import axios from "axios";
import * as cheerio from "cheerio";
import { Request, Response } from "express";

interface Chapter {
  name?: string;
  slug?: string;
}

interface TruyenTimKiemType {
  image?: string;
  name?: string;
  slug?: string;
  currentChapter?: Chapter;
  author?: string;
}

const SearchController = {
  keyword: async (req: Request, res: Response) => {
    const { keyword, page = 1 } = req.query;
    if (!keyword) {
      return res.status(404).json("Not found keyword");
    }

    const url = `${process.env.URL}/tim-kiem?tukhoa=${keyword}&page=${page}`;
    try {
      const html = await axios(url);
      const $ = cheerio.load(html.data);
      const mangas: TruyenTimKiemType[] = [];
      let total;

      $("#list-page div .list-truyen .row").each(function () {
        let manga: TruyenTimKiemType = {
          image:
            $(this).find(".col-xs-3 div .lazyimg").attr("data-desk-image") ||
            $(this).find(".col-xs-3 div .lazyimg").attr("data-image"),
          name: $(this).find(".col-xs-7 div h3 a").text(),
          slug: $(this)
            .find(".col-xs-7 div h3 a")
            .attr("href")
            ?.split(`${process.env.URL}/`)[1],
          currentChapter: {
            name: $(this).find(".col-xs-2 div a").text(),
            slug: $(this)
              .find(".col-xs-2 div a")
              .attr("href")
              ?.split(`${process.env.URL}/`)[1],
          },
          author: $(this).find(".col-xs-7 div .author").text(),
        };
        if (manga.name) {
          mangas.push(manga);
        }
      });

      $(".pagination li").each(function () {
        total = $(this).find("a").attr("href")?.split("page=")[1];
      });

      return res.json({ data: mangas, totalPage: total });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server");
    }
  },
};

export default SearchController;
