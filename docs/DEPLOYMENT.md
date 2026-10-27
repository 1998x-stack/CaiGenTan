# GitHub Pages发布和回滚

## 本地

~~~bash
npm test
npm run build
npm run serve
~~~

Node.js需20+；本地HTTP服务用Python3。浏览器访问http://localhost:4173。

## 首次启用Pages

管理员进入 https://github.com/1998x-stack/CaiGenTan/settings/pages ，在 Build and deployment → Source 选择 GitHub Actions。

再通过 https://github.com/1998x-stack/CaiGenTan/actions/workflows/pages.yml 触发发布，或将main更新触发工作流。

预期站点：https://1998x-stack.github.io/CaiGenTan/

代码文件存在不等于已经启用或部署成功。若configure-pages报告 Get Pages site failed / Not Found，优先检查设置，而不是盲目改代码。使用默认GITHUB_TOKEN加enablement参数不一定有自动启用所需管理权限。

## 发布链路

main推送 → npm test → npm run build → configure-pages → upload-pages-artifact → deploy-pages。只有工作流成功且公开站点可访问，才能标记“上线”。

## 回滚

若新提交导致P0问题，应先git revert对应提交，检查npm test和Pages恢复。更改古文字形和白话必须同步保留审校依据，不直接强制改写旧历史。