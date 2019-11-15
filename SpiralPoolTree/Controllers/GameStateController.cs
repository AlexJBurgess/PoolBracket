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

        public GameStateController(IHostingEnvironment environment)
        {
            repository = new GameStateRepository(environment.ContentRootPath + "\\Results.json");
        }

        [HttpGet("[action]")]
        public IEnumerable<MatchResult> MatchResults()
        {
            return repository.GetMatchResults();
        }

        [HttpPost("[action]")]
        public void MatchResult([FromBody] MatchResult matchResult)
        {
            repository.SetMatchResult(matchResult);
        }

        [HttpPost("[action]")]
        public void ClearMatchResult([FromQuery] int matchId)
        {
            repository.ClearMatchResult(matchId);
        }
    }
}
