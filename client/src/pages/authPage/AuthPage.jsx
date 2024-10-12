import CommonForm from "@/components/common-form/CommonForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogInFormControls,
  signUpFormControls,
} from "@/config/signUpFormControls";
import { AuthContext } from "@/context/authContect";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");

  //get the form control from context provider
  const {
    logInFormData,
    setLogInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegister,
    handleLogin,
  } = useContext(AuthContext);

  //hanlde on Tab change
  const handleOnTabChange = (tab) => {
    setActiveTab(tab);
  };

  // function to disabled login form
  const checkIfLoginValid = () => {
    return (
      logInFormData &&
      logInFormData.userEmail !== "" &&
      logInFormData.password !== ""
    );
  };
  //function to disabled signup form
  const checkIfSignUpValid = () => {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  };

  return (
    <div className=" flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">LearnX</span>
        </Link>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-background~">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleOnTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            {/*  using card here  */}

            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>
                  Welcome Back!! <span className="ml-2" />
                  Please Sign In
                </CardTitle>
                <CardDescription>
                  Access your account by entering your registered email and
                  password below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={LogInFormControls}
                  buttonText={"Login"}
                  formData={logInFormData}
                  setFormData={setLogInFormData}
                  isButtonDisabled={!checkIfLoginValid()}
                  handleOnSubmit={handleLogin}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            {/*  using card here  */}
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>
                  Join Us!! <span className="ml-2" /> Create Your Account
                </CardTitle>
                <CardDescription>
                  Fill in your details below to sign up and start your journey
                  with us.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Sign up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpValid()}
                  handleOnSubmit={handleRegister}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
