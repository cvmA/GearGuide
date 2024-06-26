import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import { Button, Loader, Modal } from "@mantine/core";

const LoginBtn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [openLogin, setOpenLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (e) => {
    try {
      setLoading(true);
      const { email, password } = e;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error("Error:", error);
        setErrorMessage(error.message);
        setLoading(false);
      } else {
        console.log("Data:", data);
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      <Button color="gray" onClick={() => setOpenLogin(true)}>
        Login
      </Button>
      <Modal
        opened={openLogin}
        onClose={() => setOpenLogin(false)}
        centered
        title="Login"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-white" htmlFor="email">
              E-mail
            </label>
            <input
              className="rounded-md border border-[#171524] bg-neutral-200 p-2 text-black outline-none"
              name="email"
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "O campo de e-mail deve ser preenchido",
                },
                pattern: {
                  value: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i,
                  message: "E-mail inválido",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-white" htmlFor="senha">
              Senha
            </label>
            <input
              className="rounded-md border border-[#171524] bg-neutral-200 p-2 text-black outline-none"
              name="password"
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Preencha o campo de senha",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-between">
            <a
              href=""
              className="w-fit text-white underline hover:text-neutral-300"
            >
              Esqueci minha senha
            </a>
          </div>
          <button
            className="flex items-center justify-center rounded-md bg-purple-700 p-2 text-white shadow-xl "
            type="submit"
          >
            {loading ? <Loader size={24} color="white" /> : "Entrar"}
          </button>
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        </form>
      </Modal>
    </>
  );
};

export default LoginBtn;
