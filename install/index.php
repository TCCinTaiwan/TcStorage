<?php
/**
 * 安裝TcStorage
 *
 * @version 0.1.1
 * @author TCC <john987john987@gmail.com>
 * @date 2019-09-01
 * @since 0.1.0 2017-09-27 TCC: 稍微整理一下快速安裝
 * @since 0.1.1 2019-09-01 TCC: 簡單調整 PHP 排版
 */
?>
<form action="install.php" method="post">
    <pre>
安裝步驟:
    1. 建立files與logs資料夾。
-----------------------------------------------------------
    2. 登入MySQL。
        MySQL管理員帳號密碼（創建資料庫、帳號用，如有指定專用帳號不會存起來。）
            主　機：<input type="text" name="server" value="localhost" placeholder="輸入MySQL主機位址" required>*
            帳　號：<input type="text" name="account" value="root" placeholder="輸入MySQL管理員帳號" required>*
            密　碼：<input type="password" name="password" placeholder="輸入MySQL管理員密碼" required>*
-----------------------------------------------------------
    3. 設定資料庫。
        ‧ 建立資料庫。
        ‧ 建立資料庫使用者，要有剛剛建立的資料表全部權限。
        ‧ 加入兩張資料表，files、folders（資料表結構如TcStorage.sql）。
        ‧ 產生登入資訊。
        TcStorage使用資料庫、帳號密碼（之後登入MySQL都會使用到。）
            資料庫：<input type="text" name="database" value="tc_stroage_database" placeholder="輸入要使用的資料庫名稱" required>*
            （假如欲使用上面管理員帳號，此兩格留空即可）
            帳　號：<input type="text" name="new_account" placeholder="輸入帳號">
            密　碼：<input type="password" name="new_password" placeholder="輸入密碼" onchange="validatePassword();">
            確　認：<input type="password" name="confirm_new_password" placeholder="輸入確認密碼" onkeyup="validatePassword();">
    <button type="submit">執行</button>

    <span style="color: red">(注意： 安裝完成後，請刪除install資料夾)</span>
    </pre>
</form>
<script>
    var new_password = document.getElementsByName("new_password")[0], confirm_new_password = document.getElementsByName("confirm_new_password")[0];
    function validatePassword(){
        if(new_password.value != confirm_new_password.value) {
            confirm_new_password.setCustomValidity("密碼不符！");
        } else {
            confirm_new_password.setCustomValidity('');
        }
    }
</script>