import { initServer }           from './config/server.config';
import { exceptionHandler }     from './middleware/common.middleware';
import { customAuthValidator }  from './middleware/auth.middleware';
import AuthController           from './controller/auth.controller';

initServer().then(({server, app}) => {
  const NODE_PORT = process.env.PORT;

  const jwtLogin = async(req, res) => {
    console.log('req.body', req.body);
    let loginDetails = await AuthController.loginUser(req.body);
    res.setHeader('X-Token', loginDetails.authToken);
    res.cookie('X-Token', loginDetails.authToken, {maxAge: 60 * 1000});
    res.send(loginDetails.userDetails);
  };
  app.post('/jwt-login', exceptionHandler(jwtLogin));

  app.use(customAuthValidator);

  const jwtRefresh = async(req, res) => {
    res.send({});
  };
  app.post('/jwt-refresh', exceptionHandler(jwtRefresh));

  server.listen(NODE_PORT, (err) => {
    if (err) {
      console.error('failed to start server ', err);
    }
    console.log(`JWT Server running in ${NODE_PORT}`);
  });
});