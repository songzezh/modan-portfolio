/**
 * Astro 内容集合入口：集中声明本地内容的加载方式、条目 ID 和数据结构校验。
 *
 * 数据流：content 下的源文件 → glob 加载器 → generateId 生成集合内唯一 ID
 * → schema 校验内容字段 → lib 中的查询函数与页面使用集合数据。
 * 内容同步会在开发或构建过程中执行；命名或字段不符合约束时会报错。
 *
 * 本文件只负责集合配置，不直接定义页面路由、筛选排序或跨集合引用校验。
 * 这些逻辑分别由 src/pages/ 和 src/lib/ 中的对应模块负责。
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema } from './lib/project-schema';
import { journalSchema } from './lib/journal-schema';
import { gearSchema } from './lib/gear-schema';
import { gearKitSchema } from './lib/gear-kit-schema';

/** 摄影作品集：每个 JSON 文件描述一个摄影系列，供作品列表和详情页使用。 */
const projects = defineCollection({
  loader: glob({
    // 仅加载该目录直接包含的 JSON 文件，不递归匹配子目录，也不加载 README。
    pattern: '*.json',
    // 相对于项目根目录的内容路径；它不是浏览器可访问的静态资源 URL。
    base: './src/content/projects',
    // entry 是相对于 base 的文件路径，data 是加载器解析出的文件内容。
    // 显式去掉扩展名，保证集合 ID、文件名与内容中的 slug 保持一致。
    generateId: ({ entry, data }) => {
      const filename = entry.replace(/\.json$/, '');
      // 例如 stillness.json 必须声明 slug: "stillness"，避免内容标识与链接不一致。
      if (filename !== data.slug) {
        throw new Error(`Project ${entry}: filename must match its slug.`);
      }
      return filename;
    },
  }),
  // 字段类型、必填项、图片尺寸及方向等约束由独立 schema 维护。
  schema: projectSchema,
});

/** 日志集合：Markdown frontmatter 保存元数据，正文用于文章页面渲染。 */
const journal = defineCollection({
  loader: glob({
    // 仅匹配顶层 Markdown 文件；此目录中的 README.txt 不会被当作文章加载。
    pattern: '*.md',
    base: './src/content/journal',
    // 日志以文件名作为 ID 来源，不依赖 frontmatter 中额外提供 slug。
    generateId: ({ entry }) => {
      const slug = entry.replace(/\.md$/, '');
      // 允许小写字母、数字和分隔用的单个连字符，例如 at-the-waterline。
      // 拒绝空名称、大写字母、空格，以及开头、结尾或连续的连字符。
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(`Journal ${entry}: use a lowercase, hyphen-separated filename.`);
      }
      return slug;
    },
  }),
  // 校验 frontmatter 中的标题、日期、封面等元数据，不校验 Markdown 正文。
  // 草稿等字段在此定义结构，是否展示由内容查询逻辑决定。
  schema: journalSchema,
});

/** 器材集合：为概览、归档、详情、对比以及器材组合提供共用数据。 */
const gear = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: './src/content/gear',
    // 沿用 JSON 文件名与 slug 一致的约定，供详情链接及组合引用使用。
    generateId: ({ entry, data }) => {
      const filename = entry.replace(/\.json$/, '');
      if (filename !== data.slug) {
        throw new Error(`Gear ${entry}: filename must match its slug.`);
      }
      return filename;
    },
  }),
  // 器材字段与规格的校验集中在 gear-schema.ts，页面无需重复定义数据结构。
  schema: gearSchema,
});

/** 器材组合集合：保存使用场景和器材 slug 列表，通过引用复用器材数据。 */
const gearKits = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: './src/content/gear-kits',
    // 组合自身的 ID 来自文件名；其中的 gearItemSlugs 指向 gear 集合中的器材。
    generateId: ({ entry, data }) => {
      const filename = entry.replace(/\.json$/, '');
      if (filename !== data.slug) {
        throw new Error(`Gear kit ${entry}: filename must match its slug.`);
      }
      return filename;
    },
  }),
  // 校验组合字段、非空器材列表及重复引用。
  // 被引用器材是否存在，由 gear-kits.ts 调用 gear-kit-data.ts 在读取组合时检查。
  schema: gearKitSchema,
});

// 导出键名是 Astro 的集合名称，供 getCollection('projects') 等查询及类型推导使用。
// 注意：gearKits 是集合名，gear-kits 是内容目录名，两者不要求相同。
// 新增集合时，除配置 loader 与 schema 外，还必须在此导出才能注册。
export const collections = { projects, journal, gear, gearKits };
