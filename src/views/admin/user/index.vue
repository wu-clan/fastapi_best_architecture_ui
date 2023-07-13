<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.system'), $t('menu.system.sysUser')]" />
      <a-card :title="$t('menu.system.sysUser')" class="general-card">
        <a-row>
          <a-col :flex="62">
            <a-form
              :auto-label-width="true"
              :model="formModel"
              label-align="right"
            >
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item :label="$t('admin.user.form.dept')" field="name">
                    <a-tree-select
                      v-model="formModel.dept"
                      :placeholder="$t('admin.user.form.dept.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="$t('admin.user.form.username')"
                    field="leader"
                  >
                    <a-input
                      v-model="formModel.username"
                      :placeholder="$t('admin.user.form.username.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="$t('admin.user.form.phone')"
                    field="phone"
                  >
                    <a-input
                      v-model="formModel.phone"
                      :placeholder="$t('admin.user.form.phone.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="$t('admin.dept.form.status')"
                    field="status"
                  >
                    <a-select
                      v-model="formModel.status"
                      :options="statusOptions"
                      :placeholder="$t('admin.dept.form.selectDefault')"
                      allow-clear
                      @clear="resetStatus"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider direction="vertical" style="height: 30px" />
          <a-col :span="6">
            <a-space :size="'medium'" direction="horizontal">
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('admin.dept.form.search') }}
              </a-button>
              <a-button @click="resetSelect">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('admin.dept.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <div class="content">
          <a-table
            :bordered="false"
            :columns="(showColumns as TableColumnData[])"
            :data="renderData"
            :loading="loading"
            :pagination="pagination"
            :size="size"
            :scroll="{ x: 2000 }"
            row-key="id"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #dept="{ record }">
              {{ record.dept?.name }}
            </template>
            <template #roles="{ record }">
              <a-popconfirm
                :content="$t('admin.user.columns.updateUserRoles.placeholder')"
              >
                <a-input-tag
                  :model-value="roleNameList(record.roles)"
                  :readonly="true"
                />
              </a-popconfirm>
            </template>
            <template #avatar="{ record }">
              <a-avatar
                v-if="record.avatar"
                :image-url="record.avatar"
                @click="updateAvatar(record.username)"
              />
              <a-avatar v-else @click="updateAvatar(record.username)">
                {{ record.username[0] }}
              </a-avatar>
            </template>
            <template #status="{ record }">
              <a-switch
                v-model:model-value="record.status"
                :checked-text="$t(`admin.user.form.status.${record.status}`)"
                :checked-value="1"
                :disabled="switchStatus"
                :loading="loading"
                :unchecked-text="$t(`admin.user.form.status.${record.status}`)"
                :unchecked-value="0"
                @change="changeStatus(record.id)"
              />
            </template>
            <template #is_superuser="{ record }">
              <a-switch
                v-model:model-value="record.is_superuser"
                :checked-text="
                  $t(`admin.user.columns.switch.${record.is_superuser}`)
                "
                :disabled="switchStatus"
                :loading="loading"
                :unchecked-text="
                  $t(`admin.user.columns.switch.${record.is_superuser}`)
                "
                @change="changeSuper(record.id)"
              />
            </template>
            <template #is_multi_login="{ record }">
              <a-switch
                v-model:model-value="record.is_multi_login"
                :checked-text="
                  $t(`admin.user.columns.switch.${record.is_multi_login}`)
                "
                :disabled="switchStatus"
                :loading="loading"
                :unchecked-text="
                  $t(`admin.user.columns.switch.${record.is_multi_login}`)
                "
                @change="changeMultiLogin(record.id)"
              />
            </template>
            <template #operate="{ record }">
              <a-space>
                <a-link @click="EditUser(record.username)">
                  {{ $t(`admin.user.columns.edit`) }}
                </a-link>
                <a-link @click="DeleteUser(record.username)">
                  {{ $t(`admin.user.columns.delete`) }}
                </a-link>
              </a-space>
            </template>
          </a-table>
        </div>
      </a-card>
    </a-layout>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import useLoading from '@/hooks/loading';
  import {
    changeUserMulti,
    changeUserStatus,
    changeUserSuper,
    getUser,
    getUserList,
    SysUserParams,
    SysUserRes,
    SysUserRoleReq,
    updateUserRole,
  } from '@/api/user';
  import { computed, reactive, ref, watch } from 'vue';
  import { SelectOptionData, TableColumnData } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { cloneDeep } from 'lodash';
  import { Pagination } from '@/types/global';
  import { useUserStore } from '@/store';
  import string from '@/utils/string';
  import { SysRoleRes } from '@/api/role';

  type Column = TableColumnData & { checked?: true };
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();

  // 表单
  const generateFormModel = () => {
    return {
      dept: undefined,
      username: undefined,
      phone: undefined,
      status: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('admin.user.form.status.1'),
      value: 1,
    },
    {
      label: t('admin.user.form.status.0'),
      value: 0,
    },
  ]);

  // 表格
  const userStore = useUserStore();
  const currentUser = userStore.userInfo;
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const renderData = ref<SysUserRes[]>([]);
  const size = ref<SizeProps>('medium');
  const operateUsername = ref<string>('');
  const basePagination: Pagination = {
    current: 1,
    defaultPageSize: 20,
    showTotal: true,
    showPageSize: true,
    bufferSize: 3,
  };
  const pagination: Pagination = reactive({
    ...basePagination,
  });
  const EditUser = async (username: string) => {
    operateUsername.value = username;
    drawerTitle.value = t('admin.api.columns.edit.drawer');
    await fetchUser(username);
    openEdit.value = true;
  };
  const DeleteUser = async (username: string) => {
    operateUsername.value = username;
    await fetchUser(username);
    openDelete.value = true;
  };
  const updateAvatar = async (username: string) => {
    operateUsername.value = username;
    drawerTitle.value = t('admin.api.columns.edit.avatar');
    await fetchUser(username);
    openAvatar.value = true;
  };
  const switchStatus = ref<boolean>(!currentUser.is_superuser);
  const roleNameList = (roleList: SysRoleRes[]) => {
    const nameList: string[] = [];
    roleList.forEach((item) => {
      nameList.push(item.name);
    });
    return nameList;
  };
  const columns = computed<TableColumnData[]>(() => [
    {
      title: 'UUID',
      dataIndex: 'uuid',
      slotName: 'uuid',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: t('admin.user.columns.avatar'),
      dataIndex: 'avatar',
      slotName: 'avatar',
      align: 'center',
      width: 100,
    },
    {
      title: t('admin.user.columns.username'),
      dataIndex: 'username',
      slotName: 'username',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: t('admin.user.columns.nickname'),
      dataIndex: 'nickname',
      slotName: 'nickname',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: t('admin.user.columns.dept'),
      dataIndex: 'dept',
      slotName: 'dept',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: t('admin.user.columns.roles'),
      dataIndex: 'roles',
      slotName: 'roles',
      width: 200,
    },
    {
      title: t('admin.user.columns.email'),
      dataIndex: 'email',
      slotName: 'email',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: t('admin.user.columns.phone'),
      dataIndex: 'phone',
      slotName: 'phone',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: t('admin.user.columns.join_time'),
      dataIndex: 'join_time',
      slotName: 'join_time',
    },
    {
      title: t('admin.user.columns.last_login_time'),
      dataIndex: 'last_login_time',
      slotName: 'last_login_time',
    },
    {
      title: t('admin.user.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      fixed: 'right',
      width: 100,
    },
    {
      title: t('admin.user.columns.is_superuser'),
      dataIndex: 'is_superuser',
      slotName: 'is_superuser',
      align: 'center',
      fixed: 'right',
      width: 120,
    },
    {
      title: t('admin.user.columns.is_multi_login'),
      dataIndex: 'is_multi_login',
      slotName: 'is_multi_login',
      fixed: 'right',
      width: 100,
    },
    {
      title: t('admin.user.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
      align: 'center',
      fixed: 'right',
      width: 120,
    },
  ]);

  // 对话框
  const drawerTitle = ref<string>('');
  const openEdit = ref<boolean>(false);
  const openDelete = ref<boolean>(false);
  const openAvatar = ref<boolean>(false);

  // 请求用户列表
  const fetchUserList = async (params: SysUserParams = {}) => {
    setLoading(true);
    try {
      const res = await getUserList(params);
      renderData.value = res.items;
      pagination.total = res.total;
      pagination.current = params.page;
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  fetchUserList();

  // 请求用户信息
  const fetchUser = async (username = '') => {
    setLoading(true);
    try {
      const res = await getUser(username);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 更新用户角色
  const updateUserRoles = async (username: string, roles: SysUserRoleReq) => {
    setLoading(true);
    try {
      await updateUserRole(username, roles);
      await fetchUserList({
        page: pagination.current,
        size: pagination.pageSize,
      });
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 修改用户状态
  const changeStatus = async (pk: number) => {
    setLoading(true);
    try {
      await changeUserStatus(pk);
    } catch (error) {
      // console.log(error);
    } finally {
      await fetchUserList({
        page: pagination.current,
        size: pagination.pageSize,
      });
      setLoading(false);
    }
  };

  // 修改用户超级权限
  const changeSuper = async (pk: number) => {
    setLoading(true);
    try {
      await changeUserSuper(pk);
    } catch (error) {
      // console.log(error);
    } finally {
      await fetchUserList({
        page: pagination.current,
        size: pagination.pageSize,
      });
      setLoading(false);
    }
  };

  // 修改用户多点登录
  const changeMultiLogin = async (pk: number) => {
    setLoading(true);
    try {
      await changeUserMulti(pk);
    } catch (error) {
      // console.log(error);
    } finally {
      await fetchUserList({
        page: pagination.current,
        size: pagination.pageSize,
      });
      setLoading(false);
    }
  };

  // 事件: 分页
  const onPageChange = async (current: number) => {
    await fetchUserList({ page: current, size: pagination.pageSize });
  };

  // 事件: 分页大小
  const onPageSizeChange = async (pageSize: number) => {
    pagination.pageSize = pageSize;
    await fetchUserList({ page: 1, size: pageSize });
  };

  // 搜索
  const search = async () => {
    await fetchUserList({
      ...formModel.value,
    } as unknown as SysUserParams);
  };

  // 重置
  const resetSelect = () => {
    formModel.value = generateFormModel();
  };

  // 重置状态
  const resetStatus = () => {
    formModel.value.status = undefined;
  };

  // 监听columns变化
  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SysUser',
  };
</script>

<style lang="less" scoped></style>
