using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SpiralPoolTree.Data;
using SpiralPoolTree.Models;

namespace SpiralPoolTree.Controllers
{
    [Route("api/[controller]")]
    public class GameStateController : Controller
    {
        private GameStateRepository repository;
        private string logPath;

        public GameStateController(IHostingEnvironment environment)
        {
            repository = new GameStateRepository(environment.ContentRootPath + "\\Results.json");
            logPath = environment.ContentRootPath;
        }

        [HttpGet("[action]")]
        public IEnumerable<MatchResult> MatchResults()
        {
            LogDetails($"Load", "verbose.txt");

            return repository.GetMatchResults();
        }

        [HttpPost("[action]")]
        public void MatchResult([FromBody] MatchResult matchResult)
        {
            repository.SetMatchResult(matchResult);

            LogDetails($"Set Match Result. Match: {matchResult.MatchId} Winner: {matchResult.Winner}", "log.txt");
        }

        [HttpPost("[action]")]
        public void ClearMatchResult([FromQuery] int matchId)
        {
            repository.ClearMatchResult(matchId);

            LogDetails($"Clear Match Result. Match: {matchId}", "log.txt");
        }

        private void LogDetails(string message, string filename)
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;

            using (System.IO.StreamWriter file = new System.IO.StreamWriter($"{logPath}//{filename}", true))
            {
                file.WriteLine($"{DateTime.Now} {remoteIpAddress} {message}");
            }
        }
    }
}
