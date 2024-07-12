if (!/yarn\.js$/.test(process.env.npm_execpath || '') && !process.env.JENKINS_HOME) {
  // 不是用yarn安装，并且是非Jenkins环境
  console.warn('\u001b[33m你没有使用yarn，将会发生未知的错误。\u001b[39m');

  process.exit(1);
}
