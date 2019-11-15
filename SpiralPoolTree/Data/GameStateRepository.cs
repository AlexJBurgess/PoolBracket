using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using SpiralPoolTree.Models;

namespace SpiralPoolTree.Data
{
    public class GameStateRepository
    {
        private object fileLock = new object();
        private string filePath;

        public GameStateRepository(string filePath)
        {
            this.filePath = filePath;
        }

        public List<MatchResult> GetMatchResults()
        {
            return ReadFromFile();
        }

        public void SetMatchResult(MatchResult matchResult)
        {
            lock (fileLock)
            {
                List<MatchResult> matchResults = GetMatchResults();

                if (matchResults.Exists(m => m.MatchId == matchResult.MatchId))
                {
                    matchResults.First(m => m.MatchId == matchResult.MatchId).Winner = matchResult.Winner;
                }
                else
                {
                    matchResults.Add(matchResult);
                }

                WriteToFile(matchResults);
            }
        }

        public void ClearMatchResult(int matchId)
        {
            lock (fileLock)
            {
                List<MatchResult> matchResults = GetMatchResults();
                matchResults.RemoveAll(m => m.MatchId == matchId);
                WriteToFile(matchResults);
            }
        }

        private void WriteToFile(List<MatchResult> matchResults)
        {
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(filePath, false))
            {
                file.Write(JsonConvert.SerializeObject(matchResults));
            }
        }

        private List<MatchResult> ReadFromFile()
        {
            using (System.IO.StreamReader file = new System.IO.StreamReader(filePath, true))
            {
                return JsonConvert.DeserializeObject<List<MatchResult>>(file.ReadToEnd());
            }
        }
    }
}
