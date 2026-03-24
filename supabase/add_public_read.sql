-- シェアページ用：IDを知っている人なら誰でもオーラを閲覧可能にする
create policy "Public read auras by id"
  on auras for select using (true);

-- 既存の "Users read own auras" ポリシーは残しても問題ない（ORで評価される）
