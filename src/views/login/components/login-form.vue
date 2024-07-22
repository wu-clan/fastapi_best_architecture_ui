<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.sub_title') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        :rules="[{ required: true, message: $t('login.form.username.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        field="username"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          class="login-input"
          :placeholder="$t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        field="password"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          class="login-input"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        :rules="[{ required: true, message: $t('login.form.captcha.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        field="captcha"
        hide-label
      >
        <a-input
          v-model="userInfo.captcha"
          class="captcha-input"
          :placeholder="$t('login.form.captcha.placeholder')"
          allow-clear
        >
        </a-input>
        <div class="captcha-wrapper" @click="refreshCaptcha">
          <a-image class="captcha-wrapper" :preview="false" :src="imageSrc" />
        </div>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            :model-value="loginConfig.rememberPassword"
            checked="rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
        </div>
        <a-button :loading="loading" html-type="submit" long type="primary">
          {{ $t('login.form.login') }}
        </a-button>
        <a-button class="login-form-register-btn" long type="text">
          {{ $t('login.form.register') }}
        </a-button>
      </a-space>
      <a-divider orientation="center" margin="28px">
        <p style="color: var(--color-text-3) !important">
          {{ $t('login.form.oauth_login') }}
        </p>
      </a-divider>
      <a-space direction="horizontal">
        <template #split>
          <a-divider direction="vertical" />
        </template>
        <a-button type="text" shape="round" @click="linuxDoOAuth2">
          <template #icon>
            <img
              src="https://cdn.linux.do/user_avatar/linux.do/neo/144/12_2.png"
              width="32"
              height="32"
              title="LinuxDo OAuth"
              alt="LinuxDo OAuth"
              :preview="false"
              :style="{ 'border-radius': '30px' }"
            />
          </template>
        </a-button>
        <a-button type="text" shape="round" @click="linuxDoOAuth2">
          <template #icon>
            <img
              src="https://double.fkgpt.fun/?name=LDO&size=35"
              title="LinuxDo OAuth"
              alt="LinuxDo OAuth"
              :preview="false"
              :style="{ 'border-radius': '30px' }"
            />
          </template>
        </a-button>
        <a-button type="text" shape="round" @click="linuxDoOAuth2">
          <template #icon>
            <img
              src="https://cdn.linux.do/user_avatar/linux.do/neo/144/12_2.png"
              width="32"
              height="32"
              title="LinuxDo OAuth"
              alt="LinuxDo OAuth"
              :preview="false"
              :style="{ 'border-radius': '30px' }"
            />
          </template>
        </a-button>
        <a-button type="text" shape="round" @click="linuxDoOAuth2">
          <template #icon>
            <img
              src="https://double.fkgpt.fun/?name=LDO&size=35"
              title="LinuxDo OAuth"
              alt="LinuxDo OAuth"
              :preview="false"
              :style="{ 'border-radius': '30px' }"
            />
          </template>
        </a-button>
        <a-button type="text" shape="round" @click="linuxDoOAuth2">
          <template #icon>
            <img
              src="https://cdn.linux.do/user_avatar/linux.do/neo/144/12_2.png"
              width="32"
              height="32"
              title="LinuxDo OAuth"
              alt="LinuxDo OAuth"
              :preview="false"
              :style="{ 'border-radius': '30px' }"
            />
          </template>
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/auth';
  import type { HttpError } from '@/api/interceptor';
  import { getOAuth2LinuxDo } from '@/api/oauth';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    username: 'admin', // 演示默认值
    password: '123456', // demo default value
  });

  const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
    captcha: '',
  });

  const imageSrc = ref('');
  const refreshCaptcha = async () => {
    try {
      const captcha = await userStore.captcha();
      imageSrc.value = `data:image/png;base64, ${captcha}`;
    } catch (err) {
      errorMessage.value = (err as HttpError).msg;
    }
  };
  refreshCaptcha();

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      // 设置禁止后台登录
      // if (router.currentRoute.value.path === '') {
      //   if (!userStore.is_staff) {
      //     throw new Error('login.form.login.staff.errMsg');
      //   }
      // }
      setLoading(true);
      try {
        await userStore.login(values as LoginData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        await router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { username, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.username = rememberPassword
          ? username
          : t('login.form.userName.placeholder');
        loginConfig.value.password = rememberPassword
          ? password
          : t('login.form.userName.placeholder');
      } catch (err) {
        errorMessage.value = (err as HttpError).msg;
      } finally {
        setLoading(false);
      }
    }
  };

  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };

  const linuxDoOAuth2 = async () => {
    try {
      window.location.href = await getOAuth2LinuxDo();
    } catch (error) {
      // console.log(error);
    }
  };
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
  .login-input {
    height: 40px;
    border-radius: 10px;
  }
  ::v-deep(.arco-divider-text) {
    line-height: 0;
  }
  ::v-deep(.arco-divider-vertical) {
    margin: 11px;
  }
  .captcha-input {
    width: 62%;
    height: 40px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .captcha-wrapper {
    height: 40px;
    margin-left: auto;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
</style>
