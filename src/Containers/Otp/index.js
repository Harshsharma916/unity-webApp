/**
 *
 * Otp
 *
 */

import React, { memo, useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import T from "../../Components/T";
import { useNavigate } from "react-router-dom";
// import routeConstants from '@app/utils/routeConstants';
// import { Helmet } from 'react-helmet';
// import CloseHeader from '@app/components/CloseHeader/index';
// import BackIcon from 'images/back.svg';
// import { loginCreators } from "../Login/reducer";
// import { Heading } from 'Containers/Login/index';
import styled from "styled-components";
// import { Wrapper, colors } from "@app/themes";
import CardDefault from "../../Components/CardDefault/index";
import OTP from "../../Components/Otp";
import { message } from "antd";
// import { otpCreators } from "./reducer";
// import { OTP_LENGTH } from "@app/utils/constants";
// import { selectToken } from '../App/selectors';
import OtpTimer from "otp-timer";
import axios from "axios";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  // background-color: black;
`;

const Button = styled.button`
  color: white;
  background: #24a0ed;
  padding: 8px 15px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
`;

const P = styled.p`
  margin: 0px;
  font-size: ${(props) => props.s};
  font-weight: ${(props) => props.w};
  color: black;
`;
const ResendB = styled.button`
  color: white;
  background: blue;
  font-size: 8px;
  padding: 2px 5px;
  border: none;
`;
export function Otp({
  otpError,
  otpResponse,
  dispatchClearOtpData,
  loading,
  dispatchSubmitOtp,
  dispatchResendOtp,
  dispatchWebEngage,
  otpFailure,
  token,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const otpData = useSelector((state) => state.otpData);
  console.log(otpData);
  // const location = useLocation();
  // useInjectSaga({ key: "otp", saga });
  // useInjectSaga({ key: "webengageProvider", saga: webengageSaga });
  // let timeStamp = new Date().toJSON().split(".").slice(0, -1).toString();
  // useEffect(() => {
  //   if (token) {
  //     history.replace(routeConstants.addVideos.route);
  //   }
  // }, [token]);
  // useEffect(() => {
  //   if (!otpData?.phoneNumber) {
  //     history.replace(routeConstants.login.route);
  //   }
  // }, [otpData]);
  const onCloseHeader = () => {
    // dispatchClearOtpData();
    dispatch({ type: "clear" });
    navigate("/");
  };
  const verifyOtp = () => {
    if (otp.length === 4) {
      const data = {
        phone_number: Number(otpData?.phone_number),
        country_code: otpData?.country_code,
        otp: otp,
        callback: "Nothing",
      };
      axios
        .post("https://galactus.homingos.com/accounts/check_otp", data)
        .then(function (response) {
          const { data, error } = response;
          console.log(data,'DATA 1');
          // console.log(ok);
          if (!error) {
            console.log('CHECKOTP')
            // const { token, ...profile } = data.data;
            // dispatch({ type: "otpData", data: { token: token } });
            dispatch({ type: "userProfile", data: data.data });
            navigate("/page1");
          }
        })
        .catch(function (error) {
          message.error(error);
        });
    } else {
      message.error("Enter OTP!");
    }
  };

  const resendOtp = () => {
    const data = {
      phone_number: otpData?.phone_number,
      country_code: otpData?.country_code,
    };
    axios
      .post("https://galactus.homingos.com/accounts/resend_otp", data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        message.error(error);
      });
  };

  return (
    <Wrapper>
      <CardDefault>
        <P s="14px" w="400" onClick={onCloseHeader}>
          {"<-  Change number"}
        </P>
        <OTP otpError={otpFailure} otp={otp} setOtp={setOtp} error={false} />
        <OtpTimer seconds={0} minutes={2} resend={resendOtp} />
        <Button onClick={verifyOtp}>Submit OTP</Button>
      </CardDefault>
    </Wrapper>
  );
}

export default Otp;