import axios from "axios";
import { Request, Response } from "express";
import { parse } from "node-html-parser";
const CategoryController = {
  getCategory: async (req: Request, res: Response) => {
    const url = process.env.URL as string;
    try {
      const html = await axios(url);
      const root = parse(html.data);
      let categories: any = [];
      root.querySelectorAll(".dropdown-menu li").forEach((item: any) => {
        const name = item
          .querySelector("a")
          .getAttribute("href")
          .split("danh-sach/")[1];
        const slug = item.querySelector("a").innerText;
        if (name && slug) {
          categories.push({ name, slug });
        }
      });

      return res.json(categories);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server");
    }
  },
};

export default CategoryController;
