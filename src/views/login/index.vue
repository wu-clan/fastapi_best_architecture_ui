<template>
  <div class="container">
    <div class="logo">
      <logImage />
      <div class="logo-text">FBA</div>
    </div>
    <LoginBanner />
    <div class="content">
      <div class="content-inner">
        <LoginForm />
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  import { Notification } from '@arco-design/web-vue';
  import { h } from 'vue';
  import logImage from '@/assets/logo.svg';
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';

  Notification.info({
    title: '互动',
    content: () =>
      h('div', { style: 'line-height: 1.75; font-size: 14px;' }, [
        // 第一句话和链接在一起
        h('p', { style: 'margin-bottom: 12px; color: #333;' }, [
          '欢迎加入我们的唯一社区：',
          h(
            'a',
            {
              href: 'https://discord.gg/yNN3wTbVAC',
              target: '_blank',
              rel: 'noopener noreferrer',
              style: {
                color: '#7289da',
                textDecoration: 'none',
                borderBottom: '1px solid #7289da',
                transition: 'border-bottom 0.2s ease',
              },
            },
            'Discord'
          ),
        ]),

        // 第二段文字
        h(
          'p',
          { style: 'margin-bottom: 5px; color: #333;' },
          '在这里，你可以进行很多有趣的讨论，还有很多好玩的机器人等你来探索哟'
        ),
      ]),
    showIcon: false,
    closable: true,
    duration: 1000 * 10,
  });
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;

    .banner {
      width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    top: 24px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: var(--color-text-3);
      font-size: 20px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>
