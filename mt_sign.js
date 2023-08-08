const express = require('express');
const H5guard = require('./mtsig');

const app = express();
app.use(express.json());

app.post('/sign', async (req, res, next) => {
  const { url, cookie, userAgent, data } = req.body;

  // 校验请求参数
  const missingParams = [];
  if (!url) missingParams.push('url');
  if (!cookie) missingParams.push('cookie');
  if (!userAgent) missingParams.push('userAgent');
  if (!data) missingParams.push('data');
  if (missingParams.length > 0) {
    return res.status(400).json({
      code: -1,
      msg: `缺少必要的参数: ${missingParams.join(', ')}`
    });
  }

  try {
    const h5guard = new H5guard(cookie, userAgent);
    const { mtgsig } = await h5guard.sign(url, data);

    const response = {
      mtFingerprint: data.mtFingerprint,
      mtgsig
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/sign', (req, res, next) => {
  res.status(400).json({
    code: -1,
    message: '请使用POST请求'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = 5779;
const host = '0.0.0.0'; // 或者使用你的服务器的公共IP地址
app.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}`);
});