import { query } from "./../lib/database"
import { getCache } from "./../lib/userCache"

export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

// ランキング全体
export async function leaderboard(req: any,res: any,route: any)
{
	//ユーザ情報はsessionの中に全部入ってる
	let session = await getCache(route.query.session);
	if(!session)
	{
	  return { status: 200 };
	}

	//ランキングテーブルから10人分の接情報を検索する
	const result = await query("SELECT point, userid FROM RankingUser ORDER BY point DESC LIMIT 10",[]);
	
	return { 
		status: 200,
		result
	};
}

//ユーザーの現在のランキング情報
export async function userInfo(req: any,res: any,route: any)
{
	console.log("ユーザーインフォ取得開始");
	//ユーザ情報はsessionの中に全部入ってる
	let session = await getCache(route.query.session);
	if(!session)
	{
		console.log("err");
	  return { status: 200 };
	}
	console.log("セッションはOK");
	let user = await query("SELECT * FROM RankingUser WHERE userid = ?",[session.userId]);
	if(!user)
	{
		console.log("ユーザーが見つからなかったから作る");
		await query("INSERT INTO RankingUser(userid, point) VALUES ( ?, 0)",[session.userId]);
	}

	//ランキングテーブルから接続中のプレイヤーの情報を検索する
	const point = await query("SELECT point FROM RankingUser WHERE id = ?",[session.userId]);
	const name = await query("SELECT name FROM User WHERE id = ?",[session.userId]);
	
	if(!point)
	{
		console.log("ユーザーIDがないよ");
		return { status: 200 };
	}

	return { 
		status: 200,
		point: point,
		userName: name
	};
}

// セッションのユーザーがポイントを獲得する
export async function update(req: any,res: any,route: any)
{
	//ユーザ情報はsessionの中に全部入ってる
	let session = await getCache(route.query.session);
	if(!session)
	{
		return { status: 200 };
	}
	
	let user = await query("SELECT * FROM RankingUser WHERE userid = ?",[session.userId]);
	if(!user)
	{
		await query("INSERT INTO RankingUser(userid, point) VALUES ( ?, ?)",[session.userId,1]);
		return { status: 200 };
	}

	await query("UPDATE RankingUser SET point = point + 1 WHERE userid = ?",[session.userId]);
	
	return
	 { 
		status: 200
	};
}

