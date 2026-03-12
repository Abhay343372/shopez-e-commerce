import { FormHelperText, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOtpVerificationError,
  resetOtpVerificationStatus,
  selectLoggedInUser,
  selectOtpVerificationError,
  selectOtpVerificationStatus,
  verifyOtpAsync,
} from "../AuthSlice";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const OtpVerfication = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedInUser = useSelector(selectLoggedInUser);
  const otpVerificationStatus = useSelector(selectOtpVerificationStatus);
  const otpVerificationError = useSelector(selectOtpVerificationError);

  // redirect logic
  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login");
    } else if (loggedInUser?.isVerified) {
      navigate("/");
    }
  }, [loggedInUser]);

  // verify otp
  const handleVerifyOtp = (data) => {
    const payload = {
      ...data,
      userId: loggedInUser?._id,
    };
    dispatch(verifyOtpAsync(payload));
  };

  // error handling
  useEffect(() => {
    if (otpVerificationError) {
      toast.error(otpVerificationError.message);
    }

    return () => {
      dispatch(clearOtpVerificationError());
    };
  }, [otpVerificationError]);

  // success handling
  useEffect(() => {
    if (otpVerificationStatus === "fullfilled") {
      toast.success("Email verified successfully!");
    }

    return () => {
      dispatch(resetOtpVerificationStatus());
    };
  }, [otpVerificationStatus]);

  return (
    <Stack
      width="100vw"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 380,
          display: "flex",
          flexDirection: "column",
          rowGap: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center">
          Verify Your Email
        </Typography>

        <Stack component="form" rowGap={2} onSubmit={handleSubmit(handleVerifyOtp)}>

          <Stack>
            <Typography variant="body2" color="text.secondary">
              Enter OTP for
            </Typography>
            <Typography fontWeight={600}>
              {loggedInUser?.email}
            </Typography>
          </Stack>

          <Stack>
            <TextField
              {...register("otp", {
                required: "OTP is required",
                minLength: {
                  value: 4,
                  message: "Please enter a 4 digit OTP",
                },
              })}
              fullWidth
              type="number"
              label="OTP"
            />

            {errors?.otp && (
              <FormHelperText error>
                {errors.otp.message}
              </FormHelperText>
            )}

            <FormHelperText>
              SMTP email service is not working on Render.  
              You can use <b>999999</b> as OTP.
            </FormHelperText>
          </Stack>

          <LoadingButton
            loading={otpVerificationStatus === "pending"}
            type="submit"
            variant="contained"
            fullWidth
            size="large"
          >
            Verify OTP
          </LoadingButton>

        </Stack>
      </Paper>
    </Stack>
  );
};