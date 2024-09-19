import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from "@/composables/auth/user";
import { auth_api } from "@/api_factory/modules/auth";

const credential = {
  email: ref(""),
  password: ref(""),
};

export const use_auth_login = () => {
  const router = useRouter();
  const loading = ref(false);

  const isFormDisabled = computed(() => {
    return (
      loading.value || !credential.email.value || !credential.password.value
    );
  });

  const login = async () => {
    loading.value = true;
    try {
      const res = await auth_api.$_login({
        email: credential.email.value,
        password: credential.password.value,
        app: 'admin-app'
      });
      // window.location.href = "/dashboard"

      if(res.status == 200 || res.status == 201){
        console.log(res, 'res here');
        useUser().createUser(res.data);
        router.push("/dashboard");
        window.location.href = "/dashboard"
      }

    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., show an error message)
    } finally {
      loading.value = false;
    }
  };

  return { credential, login, loading, isFormDisabled };
};
