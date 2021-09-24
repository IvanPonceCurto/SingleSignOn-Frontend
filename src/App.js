import './App.css';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import VisibilityOff from '@material-ui/icons/Visibility';
import Visibility from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import Zoom from '@material-ui/core/Zoom';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import ReactLoading from 'react-loading';
import Success from './components/success'
import Error from './components/error'
import {getCredentials} from './controller/users.controller'

const useStyles = makeStyles({
  card: {
    width: 320,
    height: 450,
    position: 'relative',
    marginTop: 180
  },
  cardContent: {
    visibility: true
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    width: 175,
    height: 40,
    position: 'absolute',
    left: '24%',
    top: '78%',
    marginTop: '30px',
  },
  textfield: {
    width: 267,
    position: 'relative',
    left: '3%',
    marginTop: '50px',
    marginBottom: '20px'
  },
  img: {
    marginLeft: 15
  },
  hl: {
    position: 'absolute',
    left: '10%',
    bottom: '22%',
    marginTop: '30px',
    color: "#4285F4",
    cursor: 'pointer'
  },
  loading: {
    position: 'relative',
    marginTop: 125
  }
});

function App() {

  const classes = useStyles();
  const [values, setValues] = React.useState({
    email: '',
    password: '',
    showPassword: false,
    flag: false,
  });

  const [openError, setOpenError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(true)
  const [errorTenant, setErrorTenant] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)
  const [token, setToken] = React.useState('')
  const [clientUrl, setClientUrl] = React.useState('');

  useEffect(() => {
    redirigir(clientUrl)
  }, [token])


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value, flag: false });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleFlag = () => {
    setValues({ ...values, flag: true });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const login = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tenant = urlParams.get('tenant')
    handleFlag()
    if (values.email !== '' && values.password !== '') {
      setIsLoading(true)
      let res = await getCredentials(values.email, values.password, tenant) //llamada al back
      console.log("XX - CAMBIO PARA GITHUB ACTIONS")
      if (res.rdo === 200) { //si las credenciales son correctas redirijo
        setLoaded(true)
        setError(false)
        setToken(res.data.token)
        setClientUrl(res.data.redirect)
        //redirigir(res.data.redirect);
        setTimeout(() => {
          window.location.assign(res.data.redirect);
        },1500
        )
      } else if (res.rdo === 401) { // si las credenciales son incorrectas -> reintentar
        setLoaded(true)
        setError(true)
      } else if(res.rdo === 500) { // el usuario no pertenece al tenant
        setLoaded(true)
        setError(false)
        setErrorTenant(true)
      }
    } else {
      handleClickError()
    }
  }

  const handleClickError = () => {
    setOpenError(true);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenError(false);
  };

  const redirigir = (url) => {
    
    if (!error) {
      setTimeout(() => {
        window.location = url;
          
      }, 1500);
    }
  }
  //+'?token=' + token

  const respuesta = () => {
    if (loaded && !error && !errorTenant) {
      return (
        <div>
          <Success />
        </div>
      )
    } else if (loaded && error && !errorTenant) {
      return (
        <div>
          <Error />
          <div style={{ marginLeft: 62 }}>Credenciales incorrectas</div>
          <Button className={classes.button} variant="contained" color="primary" onClick={handleIsLoading}><b>Reintentar</b></Button>
        </div>
      )
    } else if(loaded && !error && errorTenant){
      return(
        <div>
          <Error />
          <div style={{ textAlign: 'center' }}>No posee los permisos para usar este servicio</div>
          <Button className={classes.button} variant="contained" color="primary"><b>Ok</b></Button>
        </div>
      )
    }
    else {
      return (<ReactLoading className={classes.loading} type={'spin'} color={'#4285F4'} height={'50%'} width={'50%'} />)
    }
  }

  const handleIsLoading = () => {
    setIsLoading(false)
  }

 

  return (
    <div>
      {isLoading ? (
        <div>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Card id='card' className={classes.card} variant="elevation" elevation={10}>
              <CardContent>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  {respuesta()}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </div>
      ) : (
        <div>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Zoom in={true}>
              <Card id='card' className={classes.card} variant="elevation" elevation={10}>
                <CardContent >
                  <img className={classes.img} src="https://i.ibb.co/xj8BFkf/pngwing-com-1.png" alt="sso"></img>
                  <TextField
                    className={classes.textfield}
                    id="email"
                    onChange={handleChange('email')}
                    label="Correo electrónico"
                    variant="outlined"
                    value={values.email}
                    error={values.email === '' && values.flag === true}
                  />
                  <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                    <InputLabel style={values.password === '' && values.flag === true ? ({ color: '#F44336', marginLeft: 10 }) :
                      ({ marginLeft: 10 })} htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                    <OutlinedInput
                      id="password"
                      type={values.showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={handleChange('password')}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={90}
                      error={values.password === '' && values.flag === true}
                      style={{
                        left: '3%'
                      }}
                    />
                  </FormControl>
                  <Button className={classes.button} variant="contained" color="primary" onClick={login} ><b>Iniciar Sesión</b></Button>
                </CardContent>
              </Card>
            </Zoom>
            <Snackbar open={openError} autoHideDuration={3000} onClose={handleCloseError}>
              <Alert onClose={handleCloseError} severity="error">
                Complete los campos correctamente.
              </Alert>
            </Snackbar>
          </Grid>

        </div>
      )}
    </div>
  );
}

export default App;
