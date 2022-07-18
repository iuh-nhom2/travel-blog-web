import createClient from "services/apollo/apolloCleint";
import LOGIN_MUTATION from "services/apollo/mutations/login";
import { getOS } from "utils";
import toastr from 'toastr';
import auth from "utils/auth";
import { appSetAuth } from "modules/App/actions";

export const handleRequestLogin = async (values, navigation, callback, dispatch) => {
  try{
    const input = {
      userName: values.username,
      password: values.password,
      typeDevice: "browser",
      deviceId:'',
      os: getOS(),
    }
    const client = await createClient();
    const resultLogin = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: input
    })
    console.log('resultLogin', resultLogin);
    if(resultLogin?.data?.userLogin?.isSuccess && resultLogin?.data?.userLogin?.auth){
      auth.setToken(resultLogin.data.userLogin.auth.token);
      dispatch(appSetAuth({
        token: resultLogin.data.userLogin.auth.token
      }))
      // navigation('/home')
    }else {
      const message = resultLogin?.data?.userLogin?.message || 'Login Failed, Pls try again!';
      toastr.warning(message, 'Login Failure', {
        progressBar: false,
        positionClass: 'toast-bottom-left',
        preventDuplicates: true,
      })
    }
    callback?.();
  }catch(error){
    console.log('errorLogin', error);
    callback?.();
  }
}