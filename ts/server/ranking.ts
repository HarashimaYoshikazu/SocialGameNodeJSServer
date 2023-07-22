import { query } from "./../lib/database"
import { getCache } from "./../lib/userCache"

export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

//検索だけならGETリクエスト
//ただしここのファイルで書くうえでは特にGETとPOSTに差分はない
export async function getMyInfo(req: any,res: any,route: any)
{
	//ユーザ情報はsessionの中に全部入ってる
	let session = await getCache(route.query.session);
	if(!session)
	{
	  return { status: 200 };
	}

	//ランキングテーブルから接続中のプレイヤーの情報を検索する
	const result = await query("SELECT * FROM RankingUser WHERE id = ?",[session.userId]);
	
	
	return { 
		status: 200,
		user: result[0]
	};
}

//何かを更新するならPOSTリクエスト
//ただしここのファイルで書くうえでは特にGETとPOSTに差分はない
//POSTの場合はtokenが更新される
export async function getUserPoint(req: any,res: any,route: any)
{
	//ユーザ情報はsessionの中に全部入ってる
	let session = await getCache(route.query.session);
	if(!session)
	{
		return { status: 200 };
	}
	
	await query("UPDATE User SET rank = rank + 1 WHERE id = ?",[session.userId]);
	
	return { 
		status: 200
	};
}

